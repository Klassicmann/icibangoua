<?php
require_once dirname( __FILE__ ) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

// Force memory and time limits
ini_set('memory_limit', '512M');
set_time_limit(0);

echo "Starting Robust Image Repair...\n";

// Find all posts that still contain "icibangoua.net" in content
$args = [
    'post_type' => 'post',
    'posts_per_page' => -1,
    's' => 'icibangoua.net'
];

$query = new WP_Query($args);
$posts = $query->posts;

echo "Found " . count($posts) . " posts with potential hotlinked images.\n";

foreach ($posts as $post) {
    echo "\nProcessing Post ID {$post->ID}: {$post->post_title}\n";
    $content = $post->post_content;
    
    // Find ALL remote URLs (normal and escaped)
    preg_match_all('/https?:\/\/icibangoua\.net\/wp-content\/uploads\/[^\s"\'>\\\]+/i', $content, $matches);
    
    if (empty($matches[0])) {
        // Try escaped ones
        preg_match_all('/https?:\\\\\/\\\\\/icibangoua\.net\\\\\/wp-content\\\\\/uploads\\\\\/[^\s"\'>\\\]+/i', $content, $matches);
    }

    if (empty($matches[0])) {
        echo "No image URLs found in content.\n";
        continue;
    }

    $urls = array_unique($matches[0]);
    $updated_content = $content;
    $success_count = 0;

    foreach ($urls as $url) {
        $clean_url = str_replace('\\/', '/', $url);
        echo " - Sideloading: $clean_url\n";
        
        $att_id = media_sideload_image($clean_url, $post_id, null, 'id');
        
        if (!is_wp_error($att_id)) {
            $local_url = wp_get_attachment_url($att_id);
            $updated_content = str_replace($url, $local_url, $updated_content);
            echo "   SUCCESS -> $local_url\n";
            $success_count++;
        } else {
            echo "   FAILED: " . $att_id->get_error_message() . "\n";
        }
        
        // Brief sleep to avoid hammer-ing or timeouts
        usleep(50000); 
    }

    if ($success_count > 0) {
        wp_update_post([
            'ID' => $post->ID,
            'post_content' => $updated_content
        ]);
        echo "Post updated with $success_count images!\n";
    } else {
        echo "No images were successfully replaced.\n";
    }
}

echo "\nRepair complete.\n";
?>
