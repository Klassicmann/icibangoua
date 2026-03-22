<?php
require 'wp-load.php';
$count = wp_count_posts()->publish;
echo "Total published posts: $count\n\n";

$args = [
    'posts_per_page' => 10,
    'offset' => 280,
    'post_status' => 'publish',
    'orderby' => 'ID',
    'order' => 'DESC'
];
$posts = get_posts($args);
if (empty($posts)) {
    echo "No posts found at offset 280.";
} else {
    foreach ($posts as $i => $p) {
        echo ($i + 280) . ": ID={$p->ID}, Title={$p->post_title}\n";
    }
}
