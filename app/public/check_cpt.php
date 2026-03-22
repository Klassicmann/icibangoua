<?php
require 'wp-load.php';
$types = ['lms_module', 'civic_media'];
foreach($types as $t) {
    $p = get_posts(['post_type' => $t, 'posts_per_page' => 1]);
    echo "Type $t count: " . count($p) . "\n";
    if (count($p) > 0) {
        echo "Example: " . $p[0]->post_title . "\n";
    }
}
