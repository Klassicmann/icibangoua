<?php
require_once dirname( __FILE__ ) . '/wp-load.php';
header('Content-Type: text/plain; charset=utf-8');

global $wpdb;
$post_id = isset($_GET['id']) ? intval($_GET['id']) : 23;

// Get raw from DB
$raw = $wpdb->get_var($wpdb->prepare("SELECT post_content FROM {$wpdb->posts} WHERE ID = %d", $post_id));

echo "=== RAW CONTENT SEARCH ===\n";
echo "Content length: " . strlen($raw) . "\n\n";

// Search for ALL URLs in the content
preg_match_all('/https?:\/\/[^\s"\'\<\>]+/i', $raw, $matches);
echo "Total URLs found: " . count($matches[0]) . "\n\n";
foreach ($matches[0] as $url) {
    if (strpos($url, 'icibangoua') !== false) {
        echo "ICIBANGOUA: $url\n";
    }
}

echo "\n=== First 1000 chars of raw content ===\n";
echo substr($raw, 0, 1000);
?>
