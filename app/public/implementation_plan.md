# Implementation Plan: ICIBANGOUA Web Platform (Phase 1)

## Goal Description
Based on the "Cahier des Charges Technique et Fonctionnel", the goal is to develop Phase 1 of the ICIBANGOUA web platform. The system demands a highly professional, secure, and future-proof setup, free from bloatware like traditional WordPress page builders. It will serve as the foundation for the web platform and eventually operate as a "Headless CMS" via a REST API to support the mobile application (Phase 2), which will also integrate a Python/Firebase backend.

## User Review Required
> [!IMPORTANT]
> **Frontend Architecture Decision:** The specifications call for a "Headless" CMS. To achieve the best performance, security, and developer experience (avoiding page builders), I highly recommend splitting the web platform into two parts:
> 1.  **Backend:** A stripped-down, highly secured WordPress installation acting solely as an API/data provider. We will register Custom Post Types (LMS, Media, Public News) and expose them via the WP REST API or GraphQL.
> 2.  **Frontend:** A modern frontend framework like **Next.js (React)** or **Nuxt (Vue)**. This guarantees a beautiful, lightning-fast "Mobile-First" interface, eliminates WordPress plugin bloat, and makes it incredibly easy to scale and add new features.
> 
> *Question for User:* Do you approve of this standard Headless architecture (WP Backend + Next.js Frontend), or do you prefer a traditional custom-coded WordPress theme (PHP/HTML/CSS) that does not use page builders but still runs strictly within the WordPress rendering engine?

> [!CAUTION]
> **Authentication & LMS:** The LMS requires user accounts, asynchronous discussions, and tracking. If we use Next.js, we will handle authentication via WordPress (using JWT tokens) so users can log in securely to access learning modules.

## Proposed Strategy & Phases

### Phase 1.1: WordPress Backend Setup (Data Architecture)
Instead of installing plugins for everything, we will code the data structures ourselves:
*   **Custom Post Types (CPTs) & Taxonomies:**
    *   `lms_module`: For the Civic Dialogue learning modules.
    *   `civic_media`: For articles, podcasts, videos (categorized by Country & Theme).
    *   `public_news`: For the public broadcasting channel (White papers, festivals).
*   **Custom Meta Fields:** Using code (or a streamlined ACF setup if preferred) to handle data like podcast URLs, video links, etc.
*   **REST API Enrichment:** Modifying the default WP REST API endpoints to securely expose exactly what our web frontend and future mobile app need.
*   **Role Management:** Defining specific roles (Admin, Moderator, Youth Creator, Facilitator) via code to ensure strict access control.

### Phase 1.2: Frontend Development (Modern Web App)
Assuming a Next.js Headless approach:
*   **Design System:** Implement a custom design system using Vanilla CSS or Tailwind (based on your preference) for a premium, bilingual (En/Fr), responsive interface.
*   **LMS Environment:** A secure portal for users to read/watch modules and participate in asynchronous discussions.
*   **Civic Media Hub:** Dynamic, masonry-style grids for media display with filtering by country/theme.
*   **Editorial Workflow:** An interface for youth to submit content, which goes into a "Draft" status on WordPress for moderation before publishing.

### Phase 1.3: Security & Performance
*   Locking down the `/wp-admin/` backend so only authorized administrators can access it.
*   Optimizing API responses.
*   Setting up static generation for public pages to ensure instantaneous loading.

## Verification Plan

### Automated Tests
*   Verify all WordPress REST API endpoints return data correctly and securely.
*   Test JWT Authentication flows.

### Manual Verification
*   Test the content creation workflow (submission to moderation).
*   Verify responsive layout on various screen sizes and check bilingual switching.
