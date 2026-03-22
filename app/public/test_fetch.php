<?php
require_once dirname( __FILE__ ) . '/wp-load.php';

echo "Checking CURL extension...\n";
if (extension_loaded('curl')) {
    echo "CURL is loaded.\n";
} else {
    echo "CURL is NOT loaded.\n";
}

$test_url = "https://icibangoua.net/wp-content/uploads/2024/10/Ecole-bilingue-Baloue-1.jpg";
echo "Testing remote fetch of: $test_url\n";

$response = wp_remote_get($test_url);

if (is_wp_error($response)) {
    echo "Fetch Failed: " . $response->get_error_message() . "\n";
} else {
    echo "Fetch Successful! HTTP Code: " . wp_remote_retrieve_response_code($response) . "\n";
    echo "Content Size: " . strlen(wp_remote_retrieve_body($response)) . " bytes\n";
}
?>
