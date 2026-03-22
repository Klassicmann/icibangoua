<?php
require_once dirname( __FILE__ ) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

ini_set('memory_limit', '512M');
set_time_limit(0);

header('Content-Type: text/plain; charset=utf-8');

global $wpdb;

// Find all posts containing icibangoua.net in the database
$posts = $wpdb->get_results(
    "SELECT ID, post_title 
     FROM {$wpdb->posts} 
     WHERE post_status = 'publish' 
     AND post_type = 'post' 
     AND post_content LIKE '%icibangoua.net%'"
);

echo "Found " . count($posts) . " posts with hotlinked images.\n\n";

foreach ($posts as $post_info) {
    $post_id = $post_info->ID;
    $post = get_post($post_id);
    echo "--- Post ID $post_id: {$post_info->post_title}\n";
    
    // Get raw content directly from DB
    $raw_content = $wpdb->get_var($wpdb->prepare(
        "SELECT post_content FROM {$wpdb->posts} WHERE ID = %d", 
        $post_id
    ));
    
    // Match all icibangoua.net image URLs
    preg_match_all('/https?:\/\/icibangoua\.net\/wp-content\/uploads\/[^\s"\'<>]+/i', $raw_content, $matches);
    $urls = array_unique($matches[0]);
    
    if (empty($urls)) {
        echo "  No URLs found (strange?)\n";
        // Dump 200 chars around the first occurrence
        $pos = strpos($raw_content, 'icibangoua.net');
        echo "  Context: " . substr($raw_content, max(0, $pos - 20), 200) . "\n";
        continue;
    }
    
    echo "  Found " . count($urls) . " image URLs\n";
    $updated = $raw_content;
    
    foreach ($urls as $url) {
        echo "  Sideloading: $url\n";
        
        $tmp = download_url($url);
        if (is_wp_error($tmp)) {
            echo "  FAIL download: " . $tmp->get_error_message() . "\n";
            continue;
        }
        
        $file_arr = [
            'name'     => basename(parse_url($url, PHP_URL_PATH)),
            'tmp_name' => $tmp,
        ];
        
        $att_id = media_handle_sideload($file_arr, $post_id);
        
        if (is_wp_error($att_id)) {
            @unlink($tmp);
            echo "  FAIL sideload: " . $att_id->get_error_message() . "\n";
            continue;
        }
        
        $local_url = wp_get_attachment_url($att_id);
        echo "  OK -> $local_url\n";
        $updated = str_replace($url, $local_url, $updated);
    }
    
    if ($updated !== $raw_content) {
        // Update directly in the DB to bypass serialization issues
        $wpdb->update(
            $wpdb->posts,
            ['post_content' => $updated],
            ['ID' => $post_id]
        );
        echo "  Post UPDATED!\n";
        clean_post_cache($post_id);
    }
}

echo "\nDone!\n";
?>
