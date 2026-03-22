<?php
require_once dirname( __FILE__ ) . '/wp-load.php';
header('Content-Type: text/plain; charset=utf-8');

global $wpdb;
$post_id = isset($_GET['id']) ? intval($_GET['id']) : 7;

$raw = $wpdb->get_var($wpdb->prepare(
    "SELECT post_content FROM {$wpdb->posts} WHERE ID = %d",
    $post_id
));

echo "Post $post_id content length: " . strlen($raw) . "\n";
echo "Contains 'icibangoua': " . (stripos($raw, 'icibangoua') !== false ? 'YES' : 'NO') . "\n\n";

// Test all regexes
$patterns = [
    'standard'  => '/https?:\/\/(?:www\.)?icibangoua\.net\/wp-content\/uploads\/[^\s"\'<>\\\\]+/i',
    'relaxed'   => '/https?:\/\/[^\s"\'<>]+icibangoua[^\s"\'<>]+\/uploads\/[^\s"\'<>\s]+/i',
    'any-url'   => '/https?:\/\/[^\s"\'<>]+\.(jpg|jpeg|png|gif|webp)/i',
];

foreach ($patterns as $name => $pattern) {
    $found = preg_match_all($pattern, $raw, $m);
    echo "Pattern '$name': matched $found times\n";
    foreach (array_unique($m[0]) as $url) {
        echo "  URL: $url\n";
    }
}

// Print the 10 lines containing icibangoua
echo "\n\n=== Lines with icibangoua ===\n";
$lines = explode("\n", $raw);
foreach ($lines as $i => $line) {
    if (stripos($line, 'icibangoua') !== false) {
        echo "Line $i: " . substr($line, 0, 500) . "\n---\n";
    }
}
?>
