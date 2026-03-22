<?php
require_once dirname( __FILE__ ) . '/wp-load.php';
header('Content-Type: text/plain; charset=utf-8');

global $wpdb;

$posts = $wpdb->get_results(
    "SELECT ID, post_title 
     FROM {$wpdb->posts} 
     WHERE post_status = 'publish' 
     AND post_type = 'post'
     AND post_content LIKE '%icibangoua.net%'"
);

echo "Posts with icibangoua.net URLs: " . count($posts) . "\n\n";
foreach ($posts as $p) {
    echo "ID {$p->ID}: {$p->post_title}\n";
}

echo "\n\n=== All published posts ===\n";
$all = $wpdb->get_results(
    "SELECT ID, post_title 
     FROM {$wpdb->posts} 
     WHERE post_status = 'publish' AND post_type = 'post'"
);
echo "Total: " . count($all) . "\n";

// Show local attachment URLs to check if they resolve
echo "\n\n=== Checking local WordPress upload URLs ===\n";
$uploads = wp_upload_dir();
echo "Upload URL: " . $uploads['baseurl'] . "\n";
echo "Upload DIR: " . $uploads['basedir'] . "\n";
echo "Files in uploads: ";
$count = iterator_count(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($uploads['basedir'], FilesystemIterator::SKIP_DOTS)));
echo $count . "\n";
?>
