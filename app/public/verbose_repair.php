<?php
require_once dirname( __FILE__ ) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

header('Content-Type: text/plain; charset=utf-8');

global $wpdb;
$post_id = 7;

echo "--- DEBUG REPAIR Post $post_id ---\n";

$raw = $wpdb->get_var($wpdb->prepare(
    "SELECT post_content FROM {$wpdb->posts} WHERE ID = %d",
    $post_id
));

echo "Initial content length: " . strlen($raw) . "\n";
$icib_count = substr_count(strtolower($raw), 'icibangoua.net');
echo "Initial 'icibangoua.net' occurrences: $icib_count\n\n";

$patterns = [
    '/icibangoua\.net/i',
    '/http/i'
];

$urls = [];
foreach ($patterns as $pattern) {
    if (preg_match_all($pattern, $raw, $matches)) {
        $urls = array_merge($urls, $matches[0]);
    }
}
$urls = array_unique($urls);

if (empty($urls)) {
    echo "No URLs matched. EXIT.\n";
    exit;
}

echo "Found " . count($urls) . " URLs to replace.\n";
$updated = $raw;

foreach ($urls as $url) {
    $clean_url = str_replace('\\/', '/', $url);
    $clean_url = rtrim($clean_url, '\'"<>\\');
    echo "\nOriginal: $url\n";
    echo "Clean:    $clean_url\n";

    $tmp = download_url($clean_url);
    if (is_wp_error($tmp)) {
        echo "FAIL download: " . $tmp->get_error_message() . "\n";
        continue;
    }

    $file_arr = [
        'name'     => basename(parse_url($clean_url, PHP_URL_PATH)),
        'tmp_name' => $tmp,
    ];

    $att_id = media_handle_sideload($file_arr, $post_id);

    if (is_wp_error($att_id)) {
        @unlink($tmp);
        echo "FAIL sideload: " . $att_id->get_error_message() . "\n";
        continue;
    }

    $local = wp_get_attachment_url($att_id);
    echo "Local:    $local\n";

    $new_updated = str_replace($url, $local, $updated);
    if ($new_updated === $updated) {
        echo "WARNING: str_replace failed to find original URL in content!\n";
        // Check for escaped version in original
        $escaped_url = str_replace('/', '\/', $url);
        echo "Trying escaped replacement: $escaped_url\n";
        $new_updated = str_replace($escaped_url, $local, $updated);
        if ($new_updated === $updated) {
            echo "STILL FAILED replacement.\n";
        } else {
            echo "Replacement SUCCESS with escape logic.\n";
        }
    } else {
        echo "Replacement SUCCESS.\n";
    }
    $updated = $new_updated;
}

if ($updated !== $raw) {
    $res = $wpdb->update($wpdb->posts, ['post_content' => $updated], ['ID' => $post_id]);
    echo "\nDB Update result: " . ($res === false ? 'FAILED' : "SUCCESS ($res rows affected)") . "\n";
    
    $verify = $wpdb->get_var($wpdb->prepare(
        "SELECT post_content FROM {$wpdb->posts} WHERE ID = %d",
        $post_id
    ));
    $new_icib_count = substr_count(strtolower($verify), 'icibangoua.net');
    echo "New 'icibangoua.net' occurrences: $new_icib_count\n";
    
    if ($new_icib_count === 0) {
        echo "VERIFIED: Post is now clean!\n";
    } else {
        echo "STILL HAS ICIBANGOUA.NET!\n";
    }
} else {
    echo "\nNo changes to update.\n";
}
?>
