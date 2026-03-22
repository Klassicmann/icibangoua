<?php
require_once dirname( __FILE__ ) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

ini_set('memory_limit', '512M');

header('Content-Type: text/plain; charset=utf-8');

global $wpdb;

$page   = isset($_GET['page'])  ? intval($_GET['page'])  : 0;
$limit  = isset($_GET['limit']) ? intval($_GET['limit']) : 3;
$offset = $page * $limit;

$posts = $wpdb->get_results($wpdb->prepare(
    "SELECT ID, post_title 
     FROM {$wpdb->posts} 
     WHERE post_status = 'publish' 
       AND post_type   = 'post'
       AND post_content LIKE %s
     ORDER BY ID ASC
     LIMIT %d OFFSET %d",
    '%icibangoua.net%',
    $limit,
    $offset
));

$total = $wpdb->get_var($wpdb->prepare(
    "SELECT COUNT(*) FROM {$wpdb->posts} 
     WHERE post_status = 'publish' AND post_type = 'post' 
     AND post_content LIKE %s",
    '%icibangoua.net%'
));

echo "Batch $page | Offset $offset | Batch size $limit | Remaining: {$total}\n\n";

if (empty($posts)) {
    echo "No more posts to process. Done!\n";
    exit;
}

foreach ($posts as $p) {
    $post_id = $p->ID;
    echo "--- Post $post_id: {$p->post_title}\n";

    $raw = $wpdb->get_var($wpdb->prepare(
        "SELECT post_content FROM {$wpdb->posts} WHERE ID = %d",
        $post_id
    ));

    // Identify both normal and escaped URLs using the most reliable pattern from tests
    $patterns = [
        '/https?:\/\/(?:www\.)?icibangoua\.net\/[^\s"\'<>]+/i',
        '/https?:\\\\\/\\\\\/(?:www\.)?icibangoua\.net\\\\\/[^\s"\'<>]+/i'
    ];

    $urls = [];
    foreach ($patterns as $pattern) {
        if (preg_match_all($pattern, $raw, $matches)) {
            $urls = array_merge($urls, $matches[0]);
        }
    }
    $urls = array_unique($urls);

    if (empty($urls)) {
        echo "  No URLs matched. Skipping.\n";
        continue;
    }

    echo "  Found " . count($urls) . " URLs\n";
    $updated = $raw;

    foreach ($urls as $url) {
        // Clean URL: handle escaped slashes and trailing chars
        $clean_url = str_replace('\\/', '/', $url);
        $clean_url = rtrim($clean_url, '\'"<>\\');
        
        echo "  -> $clean_url\n";

        $tmp = download_url($clean_url);
        if (is_wp_error($tmp)) {
            echo "     FAIL download: " . $tmp->get_error_message() . "\n";
            continue;
        }

        $file_arr = [
            'name'     => basename(parse_url($url, PHP_URL_PATH)),
            'tmp_name' => $tmp,
        ];

        $att_id = media_handle_sideload($file_arr, $post_id);

        if (is_wp_error($att_id)) {
            @unlink($tmp);
            echo "     FAIL sideload: " . $att_id->get_error_message() . "\n";
            continue;
        }

        $local = wp_get_attachment_url($att_id);
        $updated = str_replace($url, $local, $updated);
        echo "     OK -> $local\n";
    }

    if ($updated !== $raw) {
        $wpdb->update($wpdb->posts, ['post_content' => $updated], ['ID' => $post_id]);
        clean_post_cache($post_id);
        echo "  Post UPDATED\n";
    }
}

echo "\nNext batch URL: ?page=" . ($page + 1) . "&limit=$limit\n";
echo "Remaining posts: " . max(0, $total - $offset - count($posts)) . "\n";
?>
