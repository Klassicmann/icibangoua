<?php
/**
 * Script to repair all posts by sideloading remote images from icibangoua.net
 * into the local media library and updating the post content.
 */

// Load WordPress environment
require_once dirname( __FILE__ ) . '/wp-load.php';

// Include necessary media files
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

// Increase limits for heavy media processing
ini_set('memory_limit', '512M');
set_time_limit(0); // Unlimited time

echo "Starting Global Image Repair and Sideloading...\n";

$args = array(
    'post_type'      => 'post',
    'posts_per_page' => -1,
    'post_status'    => 'any',
);

$posts = get_posts($args);
$total = count($posts);
$count = 0;

echo "Found $total posts to check.\n";

foreach ($posts as $post) {
    $count++;
    echo "\n[$count/$total] Checking Post ID: $post->ID - $post->post_title\n";
    
    $content = $post->post_content;
    $updated = false;

    // 1. Repair Content Images
    // Find all remote URLs (including escaped ones)
    $patterns = [
        '/https?:\/\/icibangoua\.net\/wp-content\/uploads\/[^\s"\'>]+/i',
        '/https?:\\\\\/\\\\\/icibangoua\.net\\\\\/wp-content\\\\\/uploads\\\\\/[^\s"\'>\\\]+/i'
    ];

    $urls = [];
    foreach ($patterns as $pattern) {
        if (preg_match_all($pattern, $content, $matches)) {
            $urls = array_merge($urls, $matches[0]);
        }
    }
    $urls = array_unique($urls);

    if (!empty($urls)) {
        echo " - Found " . count($urls) . " hotlinked images in content.\n";
        foreach ($urls as $url) {
            $clean_url = str_replace('\\/', '/', $url);
            echo "   Migrating: $clean_url\n";
            
            // Bypass hotlink protection by spoofing headers
            $args = array(
                'timeout'    => 30,
                'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'headers'    => array(
                    'Referer' => 'https://icibangoua.net/',
                )
            );

            $response = wp_remote_get($clean_url, $args);

            if (is_wp_error($response)) {
                echo "   - DOWNLOAD FAILED: " . $response->get_error_message() . "\n";
                continue;
            }

            $code = wp_remote_retrieve_response_code($response);
            if ($code !== 200) {
                echo "   - DOWNLOAD FAILED: HTTP $code\n";
                continue;
            }

            $image_contents = wp_remote_retrieve_body($response);
            
            // Check if we accidentally downloaded an HTML page or a tiny file (like the Stop image)
            if (strlen($image_contents) < 2000 || strpos($image_contents, '<!DOCTYPE html>') !== false) {
                echo "   - WARNING: Downloaded content seems too small or is HTML. Skipping.\n";
                continue;
            }

            // Save to temp file
            $temp_file = wp_tempnam($clean_url);
            if (!$temp_file) {
                echo "   - FAILED to create temp file.\n";
                continue;
            }
            file_put_contents($temp_file, $image_contents);

            $file_array = array(
                'name'     => basename($clean_url),
                'tmp_name' => $temp_file,
            );
            
            $attachment_id = media_handle_sideload($file_array, $post->ID);
            
            if (is_wp_error($attachment_id)) {
                @unlink($temp_file);
                echo "   - SIDELOAD FAILED: " . $attachment_id->get_error_message() . "\n";
                continue;
            }

            $local_url = wp_get_attachment_url($attachment_id);
            $content = str_replace($url, $local_url, $content);
            $updated = true;
            echo "   - SUCCESS: Sideloaded as attachment ID $attachment_id\n";
            echo "   - Local URL: $local_url\n";
        }
    }

    // 2. Repair Featured Image if it's external or missing but available in remote API
    // (This part assumes we might need to fetch metadata if missing, but for now we focus on URLs in content)
    // If the post has a meta field 'remote_featured_url' (hypothetical), we could use it here.
    // In our migration script, we usually set the featured image.
    
    // Check if thumbnail is pointing to a remote URL (though WP thumbnails usually aren't stored as URLs)
    // But sometimes people use plugins that store external URLs.
    
    if ($updated) {
        wp_update_post(array(
            'ID' => $post->ID,
            'post_content' => $content
        ));
        echo " - Post UPDATED successfully.\n";
    } else {
        echo " - No remote images found in content.\n";
    }
}

echo "\nRepair process completed.\n";
