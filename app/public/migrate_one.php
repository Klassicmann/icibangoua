<?php
require_once dirname( __FILE__ ) . '/wp-load.php';
require_once( ABSPATH . 'wp-admin/includes/image.php' );
require_once( ABSPATH . 'wp-admin/includes/file.php' );
require_once( ABSPATH . 'wp-admin/includes/media.php' );

// Test with one specific post ID from remote
$remote_post_id = 4591; // Example ID from previous runs or just any
$media_id = 4592; // Placeholder, assuming it's a media ID
$post_id = 118; // Existing local post ID from user screenshot

$image_url = "https://icibangoua.net/wp-content/uploads/2025/08/M-KUETCHE-Guy-Olivier-PLEG-nouveau-Directeur-du-CES-de-BANGOUA-SUD-2025.jpg";

echo "Attempting to sideload: $image_url\n";
$att_id = media_sideload_image( $image_url, $post_id, null, 'id' );

if ( is_wp_error( $att_id ) ) {
    echo "Error: " . $att_id->get_error_message() . "\n";
} else {
    set_post_thumbnail( $post_id, $att_id );
    echo "Success! Attached media ID: $att_id\n";
}
?>
