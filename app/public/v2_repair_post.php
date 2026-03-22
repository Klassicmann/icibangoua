<?php
require_once dirname( __FILE__ ) . '/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if (!$id) die("No ID provided.");

$post = get_post($id);
if (!$post) die("Post $id not found.");

echo "Start repairing post $id: " . $post->post_title . "\n";
$content = $post->post_content;

// Find all remote URLs (including escaped ones)
$patterns = [
    '/https?:\/\/icibangoua\.net\/wp-content\/uploads\/[^\s"\'>]+/i',
    '/https?:\\\\\/\\\\\/icibangoua\.net\\\\\/wp-content\\\\\/uploads\\\\\/[^\s"\'>\\\]+/i'
];

$urls = [];
foreach ($patterns as $pattern) {
    if (preg_match_all($pattern, $content, $matches)) {
        $urls = array_merge($urls, $matches[0]);
    }
}
$urls = array_unique($urls);

if (empty($urls)) {
    echo "No hotlinked images found.\n";
    exit;
}

echo "Found " . count($urls) . " images to migrate.\n";

$updated_content = $content;

foreach ($urls as $url) {
    // Clean URL if escaped
    $clean_url = str_replace('\\/', '/', $url);
    echo "URL: $clean_url\n";
    
    // Step 1: Download to temp
    $temp_file = download_url($clean_url);
    if (is_wp_error($temp_file)) {
        echo " - Step 1 FAILED: " . $temp_file->get_error_message() . "\n";
        continue;
    }
    echo " - Step 1 Success (Temp file: $temp_file)\n";

    // Step 2: Sideload
    $file_array = array(
        'name'     => basename($url),
        'tmp_name' => $temp_file,
    );
    
    $id = media_handle_sideload($file_array, $post->ID);
    
    if (is_wp_error($id)) {
        @unlink($temp_file);
        echo " - Step 2 FAILED: " . $id->get_error_message() . "\n";
        continue;
    }
    echo " - Step 2 Success (Attachment ID: $id)\n";

    // Step 3: Replace URL
    $local_url = wp_get_attachment_url($id);
    $updated_content = str_replace($url, $local_url, $updated_content);
    echo " - Step 3 Success (Replaced with $local_url)\n";
}

if ($updated_content !== $post->post_content) {
    wp_update_post(array(
        'ID' => $post->ID,
        'post_content' => $updated_content
    ));
    echo "Post UPDATED successfully!\n";
} else {
    echo "NO CHANGES made to content.\n";
}
?>
