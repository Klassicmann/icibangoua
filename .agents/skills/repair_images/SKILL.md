---
name: Repair Hotlinked Images
description: Skill to scan WordPress posts for hotlinked images from icibangoua.net, sideload them locally to bypass hotlink protection (Stop! image), and update post content.
---

# Repair Hotlinked Images

This skill provides a mechanism to fix the common "Stop! This image was hotlinked" issue by identifying remote images in post content, spoofing headers to bypass the remote site's protection, and downloading them into the local WordPress Media Library.

## How it works

1. The script `repair_all_posts.php` iterates through all published posts in the local WordPress database.
2. It uses regular expressions to find any image URLs pointing to `https://icibangoua.net/wp-content/uploads/`.
3. It downloads these images using `wp_remote_get` with a spoofed **User-Agent** and **Referer** (`https://icibangoua.net/`). This bypasses the hotlink protection that usually serves the "Stop!" placeholder.
4. It validates the downloaded content to ensure it is a real image (checking file size and content type) rather than an error page.
5. It uses `media_handle_sideload` to add the image to the local Media Library and attach it to the post.
6. It replaces the remote URL in the post content with the new local URL.

## Usage Instructions

To execute the repair process:

1. Ensure your local WordPress site is active and running (e.g., in Local by Flywheel).
2. Open a terminal in the project root.
3. Run the following command:
   ```bash
   cd "app/public"
   php repair_all_posts.php
   ```
4. Observe the output. The script will log each post being checked and the status of each image migration.
5. Once complete, refresh your local website (e.g., `http://localhost:3000`) to see the actual images instead of the "Stop!" placeholders.

## Script Location
The main script for this skill is located at `app/public/repair_all_posts.php`.
