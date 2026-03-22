<?php
require 'wp-load.php';
$slug = 'le-kack-a-bangoua-une-immersion-dans-la-profondeur-de-la-culture-camerounaise-9-juin-2023';
$p = get_page_by_path($slug, OBJECT, 'post');
if (!$p) {
    die("Post not found for slug: $slug");
}

echo "Post ID: " . $p->ID . "\n";
echo "Title: " . $p->post_title . "\n";
echo "--- Content Snippet (searching for icibangoua.net) ---\n";

if (preg_match_all('/https?:\/\/icibangoua\.net\/wp-content\/uploads\/[^\s"\'>]+/i', $p->post_content, $matches)) {
    echo "Found " . count($matches[0]) . " remote URLs:\n";
    foreach ($matches[0] as $m) {
        echo " - $m\n";
    }
} else {
    echo "No remote URLs found in content.\n";
}

// Check featured image
$thumb_id = get_post_thumbnail_id($p->ID);
if ($thumb_id) {
    echo "Featured Image ID: $thumb_id\n";
    echo "Featured Image URL: " . wp_get_attachment_url($thumb_id) . "\n";
} else {
    echo "No Featured Image set.\n";
}
