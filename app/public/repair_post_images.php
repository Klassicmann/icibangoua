<?php
require_once dirname( __FILE__ ) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

$post_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($post_id <= 0) {
    die("Please specify a valid post ID via ?id=XXX");
}
$post = get_post($post_id);

if (!$post) {
    die("Post $post_id not found.");
}

echo "Repairing Post: " . $post->post_title . "\n";
$content = $post->post_content;

// Find ALL remote URLs
preg_match_all('/https?:\/\/icibangoua\.net\/wp-content\/uploads\/[^\s"\'>]+/i', $content, $matches);

if (empty($matches[0])) {
    echo "No hotlinked images found in content.\n";
    echo "Content Preview: " . substr($content, 0, 500) . "...\n";
    exit;
}

$urls = array_unique($matches[0]);
$updated_content = $content;

foreach ($urls as $url) {
    echo "Processing URL: $url\n";
    // Sideload
    $att_id = media_sideload_image($url, $post_id, null, 'id');
    
    if (is_wp_error($att_id)) {
        echo "FAILED to sideload $url: " . $att_id->get_error_message() . "\n";
        continue;
    }
    
    $local_url = wp_get_attachment_url($att_id);
    $updated_content = str_replace($url, $local_url, $updated_content);
    echo "SUCCESS: Replaced with $local_url\n";
}

if ($updated_content !== $content) {
    wp_update_post([
        'ID' => $post_id,
        'post_content' => $updated_content
    ]);
    echo "Post updated successfully!\n";
} else {
    echo "No changes made to content.\n";
}
?>
