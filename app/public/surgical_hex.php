<?php
require_once dirname( __FILE__ ) . '/wp-load.php';
header('Content-Type: text/plain; charset=utf-8');

global $wpdb;
$post_id = 7;
$raw = $wpdb->get_var($wpdb->prepare("SELECT post_content FROM {$wpdb->posts} WHERE ID = %d", $post_id));

$pos = stripos($raw, 'icibangoua.net');
if ($pos !== false) {
    $start = max(0, $pos - 20);
    $chunk = substr($raw, $start, 150);
    echo "Found at pos $pos\n";
    echo "String context: |" . $chunk . "|\n\n";
    echo "Hex context:\n";
    for ($i = 0; $i < strlen($chunk); $i++) {
        $c = $chunk[$i];
        echo sprintf("%02X ", ord($c));
        if (($i + 1) % 16 == 0) echo "  " . str_replace("\n", " ", substr($chunk, $i-15, 16)) . "\n";
    }
    echo "\n";
} else {
    echo "NOT FOUND\n";
}
?>
