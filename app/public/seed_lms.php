<?php
/**
 * CLI Seed Script for LMS Modules
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Mock server variables for CLI
$_SERVER['HTTP_HOST'] = 'icibangoua.local';
$_SERVER['SERVER_NAME'] = 'icibangoua.local';
$_SERVER['REQUEST_URI'] = '/';
$_SERVER['REQUEST_METHOD'] = 'GET';

require_once('wp-load.php');

// Define some sample LMS modules
$modules = [
    [
        'title'   => 'Introduction au Dialogue Civique',
        'content' => 'Dans ce module, nous explorerons les bases du dialogue civique et son importance pour la cohésion sociale à Bangoua. Vous apprendrez les principes d\'écoute active et de respect mutuel.',
        'excerpt' => 'Apprenez les bases du dialogue civique et son impact sur la société.',
        'category' => 'Dialogue',
        'duration' => '45 min',
        'level'    => 'Débutant',
        'slug'     => 'intro-dialogue-civique'
    ],
    [
        'title'   => 'Leadership et Engagement des Jeunes',
        'content' => 'Ce module traite du leadership transformationnel et comment la jeunesse peut s\'impliquer activement dans les projets de développement local.',
        'excerpt' => 'Devenez un leader dans votre communauté grâce à nos outils d\'engagement.',
        'category' => 'Leadership',
        'duration' => '1h 30min',
        'level'    => 'Intermédiaire',
        'slug'     => 'leadership-engagement'
    ],
    [
        'title'   => 'Gestion de Conflits et Médiation',
        'content' => 'Apprenez les techniques de médiation pour résoudre les conflits au sein de votre entourage et promouvoir une culture de paix durable.',
        'excerpt' => 'Maîtrisez les techniques de médiation pour une paix durable.',
        'category' => 'Paix',
        'duration' => '2h',
        'level'    => 'Avancé',
        'slug'     => 'gestion-conflits'
    ],
    [
        'title'   => 'Art Ancestral et Identité Bangoua',
        'content' => 'Découvrez la signification profonde des motifs Ndop et l\'histoire de l\'art à Bangoua. Un voyage au cœur de nos racines.',
        'excerpt' => 'Un voyage culturel au cœur de l\'art et de l\'identité Bangoua.',
        'category' => 'Culture',
        'duration' => '1h',
        'level'    => 'Tous niveaux',
        'slug'     => 'art-ancestral-identite'
    ]
];

$log_file = 'seed_lms.log';
file_put_contents($log_file, "Starting seed process...\n");

foreach ($modules as $mod) {
    // Check if module already exists by slug
    if ( get_page_by_path( $mod['slug'], OBJECT, 'lms_module' ) ) {
        file_put_contents($log_file, "Module '{$mod['slug']}' already exists. Skipping.\n", FILE_APPEND);
        continue;
    }

    $post_id = wp_insert_post([
        'post_title'   => $mod['title'],
        'post_content' => $mod['content'],
        'post_excerpt' => $mod['excerpt'],
        'post_status'  => 'publish',
        'post_type'    => 'lms_module',
        'post_name'    => $mod['slug'],
    ]);

    if (!is_wp_error($post_id)) {
        // Add custom fields
        update_post_meta($post_id, 'duration', $mod['duration']);
        update_post_meta($post_id, 'level', $mod['level']);
        
        // Add to category (standard category for now)
        wp_set_object_terms($post_id, $mod['category'], 'category');

        file_put_contents($log_file, "Created module: {$mod['title']} (ID: $post_id)\n", FILE_APPEND);
    } else {
        file_put_contents($log_file, "Error creating module: {$mod['title']}\n", FILE_APPEND);
    }
}
file_put_contents($log_file, "Seed process finished.\n", FILE_APPEND);
