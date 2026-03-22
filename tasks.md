# Migration Tasks

- [x] Analyze the structure and categories of the original website (icibangoua.net).
- [x] Create a skill folder containing the scraping instructions (`SKILL.md`).
- [x] Develop a scraping script (JS/TS or Python) to extract posts, images, and categorize them correctly.
- [x] Develop the WordPress integration logic to push the scraped data into the new headless WordPress via REST API or WP-CLI.
- [x] Test the scraper on a few posts to assure data integrity and proper categorization in the new structure (CPTs/Categories).
- [x] Execute the full migration to populate the new WordPress backend.
- [x] Verify the migrated posts appear correctly in the Next.js frontend.
- [x] Fix missing featured images by updating the migration script to side-load media.
- [x] Implement single post view in the Next.js frontend (`/media/[slug]`).
- [x] Ensure post cards link to the single post view.
- [x] Final verification of content rendering and navigation.
- [x] Implement content image side-loading in the migration script.
- [x] Fix sidebar comment rendering and refine single post layout.
- [/] Re-run aggressive migration for all posts (FORCE mode).
- [/] Verify UI polish and text readability on single post view.
- [x] Mark tasks as complete in this file.
