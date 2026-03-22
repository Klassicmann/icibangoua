<?php
/**
 * Plugin Name: ICIBANGOUA Core Settings
 * Plugin URI: https://icibangoua.net
 * Description: Registers the custom post types, taxonomies, and basic REST API settings required for the Next.js Headless Frontend.
 * Version: 1.0.0
 * Author: THE NET
 * Author URI: https://icibangoua.net
 * Text Domain: icibangoua-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Register Custom Post Types: LMS Modules & Civic Media
 */
function icibangoua_register_custom_post_types() {

	// 1. LMS Module CPT
	$lms_labels = array(
		'name'                  => _x( 'Modules LMS', 'Post Type General Name', 'icibangoua-core' ),
		'singular_name'         => _x( 'Module LMS', 'Post Type Singular Name', 'icibangoua-core' ),
		'menu_name'             => __( 'LMS Modules', 'icibangoua-core' ),
		'name_admin_bar'        => __( 'Module LMS', 'icibangoua-core' ),
		'all_items'             => __( 'Tous les Modules', 'icibangoua-core' ),
		'add_new_item'          => __( 'Ajouter un Module', 'icibangoua-core' ),
		'add_new'               => __( 'Ajouter', 'icibangoua-core' ),
		'new_item'              => __( 'Nouveau Module', 'icibangoua-core' ),
		'edit_item'             => __( 'Modifier le Module', 'icibangoua-core' ),
		'update_item'           => __( 'Mettre à jour', 'icibangoua-core' ),
		'view_item'             => __( 'Voir le Module', 'icibangoua-core' ),
		'search_items'          => __( 'Chercher un Module', 'icibangoua-core' ),
	);
	$lms_args = array(
		'label'                 => __( 'Module LMS', 'icibangoua-core' ),
		'description'           => __( 'Modules d\'apprentissage pour le dialogue civique', 'icibangoua-core' ),
		'labels'                => $lms_labels,
		'supports'              => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
		'taxonomies'            => array( 'category', 'post_tag' ),
		'hierarchical'          => false,
		'public'                => true,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'menu_position'         => 5,
		'menu_icon'             => 'dashicons-welcome-learn-more',
		'show_in_admin_bar'     => true,
		'show_in_nav_menus'     => true,
		'can_export'            => true,
		'has_archive'           => true,
		'exclude_from_search'   => false,
		'publicly_queryable'    => true,
		// CRITICAL: Expose to WP REST API for Next.js
		'show_in_rest'          => true, 
		'rest_base'             => 'lms_module',
		'rest_controller_class' => 'WP_REST_Posts_Controller',
	);
	register_post_type( 'lms_module', $lms_args );

	// 2. Civic Media CPT
	$media_labels = array(
		'name'                  => _x( 'Civic Media', 'Post Type General Name', 'icibangoua-core' ),
		'singular_name'         => _x( 'Civic Media', 'Post Type Singular Name', 'icibangoua-core' ),
		'menu_name'             => __( 'Civic Media', 'icibangoua-core' ),
		'name_admin_bar'        => __( 'Civic Media', 'icibangoua-core' ),
		'all_items'             => __( 'Tous les Médias', 'icibangoua-core' ),
		'add_new_item'          => __( 'Ajouter un Média', 'icibangoua-core' ),
		'add_new'               => __( 'Ajouter', 'icibangoua-core' ),
		'new_item'              => __( 'Nouveau Média', 'icibangoua-core' ),
		'edit_item'             => __( 'Modifier le Média', 'icibangoua-core' ),
		'update_item'           => __( 'Mettre à jour', 'icibangoua-core' ),
		'view_item'             => __( 'Voir le Média', 'icibangoua-core' ),
		'search_items'          => __( 'Chercher un Média', 'icibangoua-core' ),
	);
	$media_args = array(
		'label'                 => __( 'Civic Media', 'icibangoua-core' ),
		'description'           => __( 'Articles, Podcasts, et Vidéos créés par les jeunes', 'icibangoua-core' ),
		'labels'                => $media_labels,
		'supports'              => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'author' ),
		'taxonomies'            => array( 'category', 'post_tag' ), // We can add custom 'Country' and 'Format' taxes later
		'hierarchical'          => false,
		'public'                => true,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'menu_position'         => 6,
		'menu_icon'             => 'dashicons-microphone',
		'show_in_admin_bar'     => true,
		'show_in_nav_menus'     => true,
		'can_export'            => true,
		'has_archive'           => true,
		'exclude_from_search'   => false,
		'publicly_queryable'    => true,
		// CRITICAL: Expose to WP REST API for Next.js
		'show_in_rest'          => true, 
		'rest_base'             => 'civic_media',
		'rest_controller_class' => 'WP_REST_Posts_Controller',
	);
	register_post_type( 'civic_media', $media_args );

}
add_action( 'init', 'icibangoua_register_custom_post_types', 0 );

/**
 * Register REST API Endpoints for Auth
 */
add_action( 'rest_api_init', function () {
    // 1. Login Endpoint
    register_rest_route( 'icibangoua/v1', '/login', array(
        'methods' => 'POST',
        'callback' => 'icibangoua_rest_login',
        'permission_callback' => '__return_true',
    ));

    // 2. Register Endpoint
    register_rest_route( 'icibangoua/v1', '/register', array(
        'methods' => 'POST',
        'callback' => 'icibangoua_rest_register',
        'permission_callback' => '__return_true',
    ));
});

/**
 * Login Callback
 */
function icibangoua_rest_login( $request ) {
    $creds = array(
        'user_login'    => $request->get_param( 'username' ),
        'user_password' => $request->get_param( 'password' ),
        'remember'      => true,
    );

    $user = wp_signon( $creds, false );

    if ( is_wp_error( $user ) ) {
        return new WP_Error( 'auth_failed', 'Identifiant ou mot de passe incorrect.', array( 'status' => 403 ) );
    }

    return array(
        'id'    => $user->ID,
        'name'  => $user->display_name,
        'email' => $user->user_email,
        'roles' => $user->roles,
    );
}

/**
 * Register Callback
 */
function icibangoua_rest_register( $request ) {
    $username = $request->get_param( 'username' );
    $email    = $request->get_param( 'email' );
    $password = $request->get_param( 'password' );

    if ( empty( $username ) || empty( $email ) || empty( $password ) ) {
        return new WP_Error( 'missing_fields', 'Veuillez remplir tous les champs.', array( 'status' => 400 ) );
    }

    if ( username_exists( $username ) ) {
        return new WP_Error( 'user_exists', 'Ce nom d\'utilisateur est déjà pris.', array( 'status' => 400 ) );
    }

    if ( email_exists( $email ) ) {
        return new WP_Error( 'email_exists', 'Cette adresse email est déjà utilisée.', array( 'status' => 400 ) );
    }

    $user_id = wp_create_user( $username, $password, $email );

    if ( is_wp_error( $user_id ) ) {
        return $user_id;
    }

    $user = get_user_by( 'id', $user_id );

    return array(
        'id'    => $user->ID,
        'name'  => $user->display_name,
        'email' => $user->user_email,
        'roles' => $user->roles,
    );
}

