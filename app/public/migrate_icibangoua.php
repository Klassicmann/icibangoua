<?php
/**
 * Migration script to fetch categories and posts from icibangoua.net 
 * and insert them into the local WordPress installation.
 */

// Load WordPress environment
require_once dirname( __FILE__ ) . '/wp-load.php';

// Increase limits for heavy media processing
ini_set('memory_limit', '512M');
set_time_limit(600); // 10 minutes

// Define the source URL
$source_url = 'https://icibangoua.net/wp-json/wp/v2';

// Check for force mode (HTTP or CLI)
$force_update = (isset($_GET['force']) && $_GET['force'] == '1') || (php_sapi_name() == 'cli' && in_array('--force', $argv));
if ($force_update) {
    echo "FORCE MODE ENABLED: Re-processing all images and content.\n";
}

// 1. Fetch and migrate categories
echo "Starting Category Migration...\n";
$remote_categories_url = $source_url . '/categories?per_page=100';

$response = wp_remote_get( $remote_categories_url, array('timeout' => 30) );

if ( is_wp_error( $response ) ) {
    die( "Error fetching categories: " . $response->get_error_message() );
}

$remote_categories = json_decode( wp_remote_retrieve_body( $response ), true );
$category_map = array(); // Map old category ID to new local category ID

if ( is_array( $remote_categories ) ) {
    // Sort categories to ensure parents are processed before children
    // WP REST API returns parent ID in 'parent' property.
    usort($remote_categories, function($a, $b) {
        return $a['parent'] - $b['parent'];
    });

    foreach ( $remote_categories as $remote_cat ) {
        $name = $remote_cat['name'];
        $slug = $remote_cat['slug'];
        $old_id = $remote_cat['id'];
        $old_parent_id = $remote_cat['parent'];
        
        $args = array(
            'slug' => $slug,
            'description' => $remote_cat['description']
        );
        
        if ( $old_parent_id > 0 && isset( $category_map[$old_parent_id] ) ) {
            $args['parent'] = $category_map[$old_parent_id];
        }

        $term = term_exists( $name, 'category' );
        
        if ( ! $term ) {
            $term = wp_insert_term( $name, 'category', $args );
            if ( ! is_wp_error( $term ) ) {
                echo "Created category: {$name}\n";
                $category_map[$old_id] = $term['term_id'];
            } else {
                echo "Error creating category {$name}: " . $term->get_error_message() . "\n";
            }
        } else {
            echo "Category already exists: {$name}\n";
            $category_map[$old_id] = $term['term_id'];
        }
    }
} else {
    echo "No categories found or API error.\n";
}

// 2. Fetch and migrate posts
echo "\nStarting Post Migration...\n";
$page = 1;
$total_pages = 1; // Will be updated on first request

do {
    echo "Fetching posts page {$page} of {$total_pages}...\n";
    $remote_posts_url = $source_url . '/posts?per_page=20&page=' . $page;
    $response = wp_remote_get( $remote_posts_url, array('timeout' => 45) );

    if ( is_wp_error( $response ) ) {
        echo "Error fetching posts on page {$page}: " . $response->get_error_message() . "\n";
        break;
    }
    
    // Check for HTTP errors (e.g., 400 Bad Request, if page exceeds total pages)
    $status_code = wp_remote_retrieve_response_code( $response );
    if ( $status_code != 200 ) {
        echo "Finished fetching or encountered HTTP error on page {$page} (HTTP {$status_code}).\n";
        break;
    }

    if ( $page == 1 ) {
        $headers = wp_remote_retrieve_headers( $response );
        if ( isset( $headers['x-wp-totalpages'] ) ) {
            $total_pages = intval( $headers['x-wp-totalpages'] );
        }
    }

    $remote_posts = json_decode( wp_remote_retrieve_body( $response ), true );
    
    if ( ! is_array( $remote_posts ) || empty( $remote_posts ) ) {
        break; // No more posts
    }
    
    foreach ( $remote_posts as $remote_post ) {
        $old_id = $remote_post['id'];
        $title = $remote_post['title']['rendered'];
        $content = $remote_post['content']['rendered'];
        $excerpt = $remote_post['excerpt']['rendered'];
        $date = $remote_post['date'];
        $slug = $remote_post['slug'];
        
        // Map categories
        $local_cat_ids = array();
        foreach ( $remote_post['categories'] as $old_cat_id ) {
            if ( isset( $category_map[$old_cat_id] ) ) {
                $local_cat_ids[] = $category_map[$old_cat_id];
            }
        }

        // Check if post already exists using slug
        $existing_post = get_page_by_path( $slug, OBJECT, 'post' );
        
        if ( ! $existing_post ) {
            $post_data = array(
                'post_title'    => html_entity_decode( $title ),
                'post_content'  => isset( $content ) ? $content : '',
                'post_excerpt'  => $excerpt,
                'post_status'   => 'publish',
                'post_type'     => 'post',
                'post_author'   => 1, // Default admin author
                'post_date'     => $date,
                'post_name'     => $slug,
                'post_category' => $local_cat_ids
            );

            $post_id = wp_insert_post( $post_data );

            if ( ! is_wp_error( $post_id ) ) {
                echo "Inserted post: {$title} (ID: {$post_id})\n";
                
                // Process content images first
                if ( ! empty( $content ) ) {
                    $post_data['post_content'] = process_content_images( $content, $post_id, $source_url );
                    wp_update_post( array(
                        'ID' => $post_id,
                        'post_content' => $post_data['post_content']
                    ) );
                }

                // Handle Featured Image
                if ( ! empty( $remote_post['featured_media'] ) ) {
                    migrate_featured_image( $remote_post['featured_media'], $post_id, $source_url );
                }
            } else {
                echo "Error inserting post {$title}: " . $post_id->get_error_message() . "\n";
            }
        } else {
            echo "Post already exists: {$title} (Local ID: {$existing_post->ID})\n";
            
            // Aggressive Update Mode or partial update
            if ( $force_update || strpos( $existing_post->post_content, 'icibangoua.net' ) !== false ) {
                echo "Processing images in " . ($force_update ? "FORCE" : "REPAIR") . " mode for post ID: {$existing_post->ID}...\n";
                $updated_content = process_content_images( $existing_post->post_content, $existing_post->ID, $source_url );
                if ( trim($updated_content) !== trim($existing_post->post_content) ) {
                    wp_update_post( array(
                        'ID' => $existing_post->ID,
                        'post_content' => $updated_content
                    ) );
                    echo "Updated content for post ID: {$existing_post->ID}\n";
                }
            }

            // Featured Image Update
            if ( $force_update || ! has_post_thumbnail( $existing_post->ID ) ) {
                if ( ! empty( $remote_post['featured_media'] ) ) {
                    echo "Checking/Updating featured image for existing post...\n";
                    migrate_featured_image( $remote_post['featured_media'], $existing_post->ID, $source_url );
                }
            }
        }
    }

    $page++;
} while ( $page <= $total_pages );

/**
 * Side-load featured image from remote WP
 */
function migrate_featured_image( $remote_media_id, $post_id, $source_url ) {
    require_once( ABSPATH . 'wp-admin/includes/image.php' );
    require_once( ABSPATH . 'wp-admin/includes/file.php' );
    require_once( ABSPATH . 'wp-admin/includes/media.php' );

    $media_api_url = $source_url . '/media/' . $remote_media_id;
    $response = wp_remote_get( $media_api_url );

    if ( is_wp_error( $response ) ) {
        return;
    }

    $media_data = json_decode( wp_remote_retrieve_body( $response ), true );
    if ( ! empty( $media_data['source_url'] ) ) {
        $image_url = $media_data['source_url'];
        
        // Sideload the image
        $att_id = media_sideload_image( $image_url, $post_id, null, 'id' );
        
        if ( ! is_wp_error( $att_id ) ) {
            set_post_thumbnail( $post_id, $att_id );
            echo "Attached featured image (ID: {$att_id}) to post {$post_id}\n";
        } else {
            echo "Error sideloading image: " . $att_id->get_error_message() . "\n";
        }
    }
}

/**
 * Process HTML content to sideload images and replace URLs
 */
function process_content_images( $content, $post_id, $source_url ) {
    if ( empty( $content ) ) return $content;

    require_once( ABSPATH . 'wp-admin/includes/image.php' );
    require_once( ABSPATH . 'wp-admin/includes/file.php' );
    require_once( ABSPATH . 'wp-admin/includes/media.php' );

    // Aggressive regex to find any URL pointing to icibangoua.net with an image extension
    $patterns = [
        '/https?:\/\/[^\s"\':<>]+icibangoua\.net[^\s"\':<>]+(?:jpg|jpeg|png|gif|webp)/i', // Normal URLs
        '/https?:\\\\\/\\\\\/[^\s"\':<>]+icibangoua\.net[^\s"\':<>]+(?:jpg|jpeg|png|gif|webp)/i' // Escaped URLs
    ];
    
    $found_urls = [];
    foreach ($patterns as $pattern) {
        if (preg_match_all($pattern, $content, $matches)) {
            $found_urls = array_merge($found_urls, $matches[0]);
        }
    }

    if (empty($found_urls)) return $content;

    $image_urls = array_unique($found_urls);
    
    foreach ($image_urls as $url) {
        // Clean URL for sideloading
        $clean_url = str_replace('\\/', '/', $url);

        echo "Sideloading image: $clean_url\n";
        
        // Sideload
        $att_id = media_sideload_image($clean_url, $post_id, null, 'id');
        
        if (!is_wp_error($att_id)) {
            $local_url = wp_get_attachment_url($att_id);
            // Replace both escaped and unescaped versions in content
            $content = str_replace($url, $local_url, $content);
            echo "SUCCESS: $clean_url -> $local_url\n";
        } else {
            echo "ERROR for $clean_url: " . $att_id->get_error_message() . "\n";
        }
    }

    return $content;
}

echo "\nMigration script completed.\n";
?>
