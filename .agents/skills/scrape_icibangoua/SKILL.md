---
name: Scrape and Migrate icibangoua.net
description: Skill to scrape posts and categories from the legacy icibangoua.net WordPress site and import them into the headless WordPress backend.
---

# Scrape and Migrate icibangoua.net

This skill provides the automated script and instructions to extract all existing posts and categories from the legacy `icibangoua.net` website and safely inject them into the local WordPress backend for the Phase 1 headless setup.

## How it works

1. The provided PHP script `migrate_icibangoua.php` connects to the legacy site's public WordPress REST API (`https://icibangoua.net/wp-json/wp/v2/`).
2. It fetches all categories, preserving the hierarchy (parent/child relationships) and creates them in the new local WordPress installation.
3. It fetches the posts in batches.
4. It inserts them using `wp_insert_post`, assigning the correctly mapped local categories.
5. Content, excerpts, and dates are preserved.

## Usage Instructions

To execute the migration, this PHP script should be placed inside the `app/public/` directory so it can bootstrap the local WordPress environment correctly.

1. Ensure the script `migrate_icibangoua.php` is located at `app/public/migrate_icibangoua.php`.
2. Run the script via command line to avoid browser timeouts:
   ```bash
   cd "app/public"
   php migrate_icibangoua.php
   ```
3. A progress output will be displayed. Verify the posts and categories in the WordPress Admin once it completes.

## Script Location
The companion script is provided in the project at `app/public/migrate_icibangoua.php`.
