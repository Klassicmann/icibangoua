<?php
require 'wp-load.php';
$post_types = array('post', 'lms_module', 'civic_media');
$args = array(
    'post_type'      => $post_types,
    'posts_per_page' => 5,
    'offset'         => 325,
    'post_status'    => 'any',
    'orderby'        => 'ID',
    'order'          => 'DESC'
);
$posts = get_posts($args);
foreach ($posts as $i => $p) {
    echo "[" . (325 + $i) . "] ID: " . $p->ID . " Type: " . $p->post_type . " Content Length: " . strlen($p->post_content) . " Title: " . $p->post_title . "\n";
}
