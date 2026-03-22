<?php
require 'wp-load.php';
$posts = get_posts(['posts_per_page' => 20]);
foreach($posts as $p) {
    $tid = get_post_thumbnail_id($p->ID);
    if ($tid) {
        $url = wp_get_attachment_url($tid);
        $file = get_attached_file($tid);
        $size = file_exists($file) ? filesize($file) : 0;
        echo "Post: {$p->ID}, Thumb ID: $tid, Size: $size, URL: $url\n";
    } else {
        echo "Post: {$p->ID}, No Thumb\n";
    }
}
