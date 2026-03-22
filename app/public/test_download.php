<?php
require_once dirname( __FILE__ ) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

header('Content-Type: text/plain; charset=utf-8');
echo "WordPress loaded OK\n";
echo "WP version: " . get_bloginfo('version') . "\n";
echo "Memory: " . ini_get('memory_limit') . "\n";
echo "Max exec: " . ini_get('max_execution_time') . "\n";

// Try downloading just one image
$test_url = 'https://icibangoua.net/wp-content/uploads/2023/11/FIFEBA2023-8-1.jpeg';
echo "\nAttempting to download: $test_url\n";

$tmp = download_url($test_url);
if (is_wp_error($tmp)) {
    echo "FAIL: " . $tmp->get_error_message() . "\n";
} else {
    echo "SUCCESS: Downloaded to $tmp\n";
    echo "File size: " . filesize($tmp) . " bytes\n";
    @unlink($tmp);
}
?>
