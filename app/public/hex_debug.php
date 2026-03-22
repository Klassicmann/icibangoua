<?php
require_once dirname( __FILE__ ) . '/wp-load.php';
header('Content-Type: text/plain; charset=utf-8');

global $wpdb;
$post_id = isset($_GET['id']) ? intval($_GET['id']) : 7;

$raw = $wpdb->get_var($wpdb->prepare(
    "SELECT post_content FROM {$wpdb->posts} WHERE ID = %d",
    $post_id
));

// Find position of icibangoua in content
$pos = stripos($raw, 'icibangoua');
if ($pos !== false) {
    $start = max(0, $pos - 100);
    $context = substr($raw, $start, 400);
    echo "Context around 'icibangoua':\n";
    echo $context . "\n\n";
    echo "--- HEX DUMP ---\n";
    // Show hex of the 50 chars before the URL
    $hex_context = substr($raw, $start, 200);
    for ($i = 0; $i < strlen($hex_context); $i++) {
        echo bin2hex($hex_context[$i]) . ' ';
        if (($i + 1) % 16 === 0) echo "\n";
    }
} else {
    echo "icibangoua NOT found in raw content for post $post_id\n";
}
?>
