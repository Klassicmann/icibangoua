<?php
require_once dirname( __FILE__ ) . '/wp-load.php';

$posts = get_posts(array('numberposts' => 5));
foreach ($posts as $post) {
    echo "ID: " . $post->ID . " - " . $post->post_title . "\n";
    echo "Featured Image: " . (has_post_thumbnail($post->ID) ? 'YES' : 'NO') . "\n";
    if (has_post_thumbnail($post->ID)) {
        echo " - URL: " . get_the_post_thumbnail_url($post->ID) . "\n";
    }
    
    // Check for icibangoua.net in content
    if (strpos($post->post_content, 'icibangoua.net') !== false) {
        echo " - Remote URLs found in content.\n";
    } else {
        echo " - No remote URLs found.\n";
    }
    echo "-------------------\n";
}
