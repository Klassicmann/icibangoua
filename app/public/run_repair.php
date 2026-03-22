<?php
/**
 * Advanced Batched Repair Script for icibangoua.net images.
 * Handles timeouts by processing in chunks.
 */

require_once 'wp-load.php';

// Simple security check
if (!isset($_GET['key']) || $_GET['key'] !== 'bangoua2026') {
    die('Unauthorized access.');
}

// Configuration
$batch_size = isset($_GET['batch_size']) ? intval($_GET['batch_size']) : 2; // Reduced to 2 by default
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

// Increase PHP limits for this request
ini_set('memory_limit', '1024M'); // Increased memory
set_time_limit(120); // 2 minutes per small batch

require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

// Get total count for all relevant post types
$post_types = array('post', 'lms_module', 'civic_media');
$total_posts = 0;
foreach ($post_types as $pt) {
    $counts = wp_count_posts($pt);
    $total_posts += $counts->publish + $counts->draft + $counts->private;
}

// Fetch current batch
$args = array(
    'post_type'      => $post_types,
    'posts_per_page' => $batch_size,
    'offset'         => $offset,
    'post_status'    => 'any',
    'orderby'        => 'ID',
    'order'          => 'DESC'
);

$posts = get_posts($args);
$count_in_batch = count($posts);

?>
<!DOCTYPE html>
<html>
<head>
    <title>Image Repair Progress (Multi-Type)</title>
    <style>
        body { font-family: sans-serif; background: #f0f2f5; color: #1c1e21; padding: 40px; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .progress-container { background: #e4e6eb; height: 20px; border-radius: 10px; margin: 20px 0; overflow: hidden; }
        .progress-bar { background: #0085ba; height: 100%; transition: width 0.3s; }
        .log { background: #1c1e21; color: #a8ff60; padding: 15px; border-radius: 4px; font-family: monospace; height: 300px; overflow-y: auto; font-size: 13px; line-height: 1.5; }
        .status { margin-bottom: 10px; font-weight: bold; }
        .loader { border: 3px solid #f3f3f3; border-top: 3px solid #0085ba; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; margin-right: 10px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="container">
        <h1>Repairing Hotlinked Images (All Types)</h1>
        <div class="status">
            <?php if ($count_in_batch > 0): ?>
                <div class="loader"></div> Processing items <?php echo $offset + 1; ?> to <?php echo min($offset + $batch_size, $total_posts); ?> of <?php echo $total_posts; ?>...
                <br><br>
                <div style="background: #fff4f4; border: 1px solid #ffcfcf; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                    <strong>Stuck on this item?</strong><br>
                    If this page stopped working for more than 30 seconds:<br><br>
                    <a href="?key=bangoua2026&offset=<?php echo $offset + 1; ?>&batch_size=1" style="display: inline-block; background: #ff5f56; color: white; text-decoration: none; padding: 10px 15px; border-radius: 4px; font-weight: bold; margin-right: 10px;">Skip This Item & Continue</a>
                    <a href="?key=bangoua2026&offset=<?php echo $offset; ?>&batch_size=1" style="display: inline-block; background: #0085ba; color: white; text-decoration: none; padding: 10px 15px; border-radius: 4px; font-weight: bold;">Retry This Batch (Lite)</a>
                </div>
            <?php else: ?>
                ✅ Migration Completed!
            <?php endif; ?>
        </div>
        
        <div class="progress-container">
            <?php 
                $percent = ($total_posts > 0) ? round(($offset / $total_posts) * 100) : 100;
                if ($count_in_batch == 0) $percent = 100;
            ?>
            <div class="progress-bar" style="width: <?php echo $percent; ?>%;"></div>
        </div>

        <div class="log">
            <?php
            if ($count_in_batch > 0) {
                foreach ($posts as $post) {
                    $post_index = $offset++;
                    echo "[$post_index] [Type: " . $post->post_type . "] Checking: " . esc_html($post->post_title) . " (ID: $post->ID)... ";
                    
                    $content = $post->post_content;
                    
                    // Prevent memory crashes on giant posts
                    if (strlen($content) > 1024 * 1024 * 3) { 
                        echo "<span style='color:#ffbd2e;'>SKIPPED (Giant)</span><br>";
                        echo "--------------------------------------<br>";
                        continue;
                    }

                    $updated = false;

                    // Improved patterns: match icibangoua.net with or without www
                    $patterns = [
                        '/https?:\/\/(?:www\.)?icibangoua\.net\/wp-content\/uploads\/[^\s"\'>]+/i',
                        '/https?:\\\\\/\\\\\/(?:www\.)?icibangoua\.net\\\\\/wp-content\\\\\/uploads\\\\\/[^\s"\'>\\\]+/i'
                    ];

                    $urls = [];
                    foreach ($patterns as $pattern) {
                        if (preg_match_all($pattern, $content, $matches)) {
                            $urls = array_merge($urls, $matches[0]);
                        }
                    }
                    $urls = array_unique($urls);

                    if (!empty($urls)) {
                        echo "&nbsp;&nbsp; - Found " . count($urls) . " remote URLs.<br>";
                        foreach ($urls as $url) {
                            $clean_url = str_replace('\\/', '/', $url);
                            echo "&nbsp;&nbsp; - Migrating: $clean_url... ";
                            
                            $request_args = array(
                                'timeout'    => 20,
                                'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                                'headers'    => array('Referer' => 'https://icibangoua.net/')
                            );

                            $response = wp_remote_get($clean_url, $request_args);

                            if (is_wp_error($response)) {
                                echo "<span style='color:#ff5f56;'>FAILED: " . $response->get_error_message() . "</span><br>";
                                continue;
                            }

                            $image_contents = wp_remote_retrieve_body($response);
                            
                            // Prevent memory crashes on giant images
                            if (strlen($image_contents) > 1024 * 1024 * 5) { // Skip images > 5MB
                                echo "<span style='color:#ffbd2e;'>SKIPPED (Image too giant: " . round(strlen($image_contents)/1024/1024, 2) . "MB)</span><br>";
                                continue;
                            }

                            if (strlen($image_contents) < 3000 || strpos($image_contents, '<!DOCTYPE html>') !== false) {
                                echo "<span style='color:#ffbd2e;'>SKIPPED (Not an image)</span><br>";
                                continue;
                            }

                            $temp_file = wp_tempnam($clean_url);
                            file_put_contents($temp_file, $image_contents);

                            $file_array = array('name' => basename($clean_url), 'tmp_name' => $temp_file);
                            $attachment_id = media_handle_sideload($file_array, $post->ID);
                            
                            if (is_wp_error($attachment_id)) {
                                @unlink($temp_file);
                                echo "<span style='color:#ff5f56;'>SIDELOAD FAILED</span><br>";
                            } else {
                                $local_url = wp_get_attachment_url($attachment_id);
                                $content = str_replace($url, $local_url, $content);
                                $updated = true;
                                echo "<span style='color:#a8ff60;'>SUCCESS</span><br>";
                            }
                        }
                    } else {
                        echo "&nbsp;&nbsp; - [OK] No remote images.<br>";
                    }

                    if ($updated) {
                        wp_update_post(array('ID' => $post->ID, 'post_content' => $content));
                    }

                    // 2. Featured Image Repair
                    $thumb_id = get_post_thumbnail_id($post->ID);
                    if ($thumb_id) {
                        $thumb_url = wp_get_attachment_url($thumb_id);
                        if (strpos($thumb_url, 'icibangoua.net') !== false || strpos($thumb_url, 'stop-hotlink') !== false) {
                            echo "&nbsp;&nbsp; - Checking Featured image: $thumb_url<br>";
                            // If the attachment URL itself is remote, it means the attachment was created with a remote source URL
                            // We should probably re-sideload or fix the attachment.
                        }
                    } else {
                        // Check if there is a remote featured image meta (our migration script might use '_remote_featured_url' or similar)
                        $remote_thumb_url = get_post_meta($post->ID, '_remote_featured_url', true);
                        if ($remote_thumb_url && strpos($remote_thumb_url, 'icibangoua.net') !== false) {
                             echo "&nbsp;&nbsp; - Found remote featured URL meta. Migrating... ";
                             $att_id = media_sideload_image($remote_thumb_url, $post->ID, null, 'id');
                             if (!is_wp_error($att_id)) {
                                 set_post_thumbnail($post->ID, $att_id);
                                 echo "<span style='color:#a8ff60;'>SUCCESS</span><br>";
                             } else {
                                 echo "<span style='color:#ff5f56;'>FAILED</span><br>";
                             }
                        }
                    }

                    echo "--------------------------------------<br>";
                }
            } else {
                echo "All posts have been processed! You can close this window.<br>";
            }
            ?>
        </div>

        <?php if ($count_in_batch > 0): ?>
            <script>
                // Automatically redirect to the next batch after 1 second
                setTimeout(function() {
                    window.location.href = "?key=bangoua2026&offset=<?php echo isset($_GET['offset']) ? intval($_GET['offset']) + $batch_size : $batch_size; ?>&batch_size=<?php echo $batch_size; ?>";
                }, 1000);
            </script>
        <?php endif; ?>
    </div>
</body>
</html>
