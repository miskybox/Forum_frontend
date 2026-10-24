# UI/UX Redesign — Backend Tasks

Backend repo: `miskybox/Forum_backend` (Spring Boot). This list covers what the new interface needs from the API.
Work on a backend branch `feature/new-ux-ui-api` and follow that repo’s [`AGENTS.md`](../../../Forum_backend/AGENTS.md).
Keep this file in sync with `Forum_backend/docs/BACKEND_TASKS.md`.

## Project constraints

Forum Viajeros is a **demo project**:
- Data lives in our own database (PostgreSQL). Demo content is created with seed data, not with external services.
- **Only free external APIs, without paid plans or billing accounts.** Prefer APIs that need no key.
  Allowed today: REST Countries (already used), Open-Meteo (weather, no key). Map data stays local (`countries.geojson`).
- No paid email, SMS, storage, search or analytics providers. Features that would need one are simplified (see B20) or skipped.
- Seed data must be clearly fictional (demo users and posts), never real personal data.

Priorities:
- **P1** — needed to build the redesigned pages with the features that already exist.
- **P2** — nice to have for the redesign; the UI hides the block when there is no data.
- **P3** — new product features shown in the mockups (separate scope).

## What already exists (reuse, do not rebuild)

| Need in the mockups | Existing endpoint |
|---|---|
| Explore feed | `GET /api/feed/explore`, `GET /api/feed/following` (`FeedItemDTO` already has author avatar, forum name, like and comment counts, image) |
| Like a post | `POST/GET /api/posts/{id}/like`, `GET /api/posts/{id}/like/count` |
| Follow / connect | `/api/users/{id}/follow`, `follow-stats`, `suggestions`, `mutuals` |
| Countries visited, map, ranking | `/api/travel/users/{userId}/stats`, `/places`, `/ranking` |
| Continents | `GET /api/countries/continents`, `/continent/{continent}` |
| Trending tags | `GET /api/tags/popular` |
| Categories, forums, posts, comments | `/api/categories`, `/api/forums`, `/api/posts`, `/api/comments` |

## P1 — Required for the redesign

- [x] **B1. Blog API is missing.** The frontend `blogService` calls `/api/blog/*` (categories, posts, slugs, search) but the backend has no blog controller, so the "Diarios de Viaje" section cannot work. Decide:
  - (a) implement `BlogPost`/`BlogCategory` entities and `/api/blog/*` endpoints matching `src/services/blogService.js`, or
  - (b) drop the separate blog and model "travel diaries" as posts with images (filter `hasImages=true`, see B3).
  - **Working decision: (b)** — less code, one content model, fits the demo. Revisit if a real blog is needed.
- [x] **B2. Enrich `PostResponseDTO`** so cards render without N+1 calls:
  `likeCount`, `likedByCurrentUser`, `authorAvatarUrl`, `forumTitle`, `categoryId`, `categoryName`,
  `imageUrls`, `coverImageUrl`, `imageCount`, `lastCommentAt`.
- [x] **B2b. Enrich `ForumResponseDTO`**: `createdBy` (user id), `creatorUsername`, `creatorAvatarUrl`, `categoryName`. Without `createdBy` the frontend cannot tell whether the current user owns a forum, so forum authors cannot edit or delete their own forums (only admins/moderators can).
- [x] **B3. Post listing filters and sorting** on `GET /api/posts` (and `/api/feed/explore`):
  `sort=trending|recent|top`, `unanswered=true` (commentCount = 0), `hasImages=true`, `categoryId`, `continent`, `tag`, `q`.
  Trending = weighted likes + comments in the last 7 days.
- [x] **B4. Comment replies.** `parentId` on `Comment` (one nesting level), grouped replies in `GET /api/comments/post/{postId}`, `sort=top|chronological`. Comment likes left optional.
- [x] **B5. Category metadata** for the "Canales Temáticos" list: `icon` (emoji) and `postCount` in `GET /api/categories` (`forumCount` already exists).
- [x] **B5b. Public popular tags**: anonymous `GET /api/tags` and `/api/tags/popular` (trending hashtags on the home hero).
- [x] **B6. Profile header data** in `GET /api/users/{id}`: `coverImageUrl`, `likesReceived`, `countriesVisited`, `memberSince`. `PUT /api/users/{id}/cover`.
- [x] **B6b. Avatar upload**: `POST /api/users/{id}/avatar` (multipart, stored like post images).
- [x] **B7. Posts and forums by user** with pagination: `GET /api/posts/user/{userId}` and `GET /api/forums/user/{userId}`.
- [x] **B8. Breadcrumb data** in `GET /api/posts/{id}`: forum id/title and category id/name (covered by B2).

- [x] **B8b. Password reset token in logs (security)**: `PasswordResetService` logs email, token and reset URL only when `app.demo.log-reset-links` is true (`local`/`dev`). Production sets the flag to false. No email provider is added (demo, free services only); the reset page still says no real emails are sent.

- [x] **B8c. Demo data never loads on a fresh database**: runners now go roles/categories (1) → countries (2) → env users (3) → demo content (25) → sample forums (30). Demo seed skips only when posts already exist and reuses `viajero_demo` if env created it first.
- [x] **B8d. Docker compose runs the `prod` profile only**: `Dockerfile` defaults `SPRING_PROFILES_ACTIVE=prod` without hardcoding `-D`; compose sets `local` so demo seed can run.

## Security and vulnerabilities

The **only accepted public opening** is the USER demo account (`viajero_demo`). Admin/moderator passwords stay in env and out of the SPA.

- [x] JWT HttpOnly cookies; CSRF disabled on purpose (CORS allow-list).
- [x] HTML sanitizer; login rate limit; reset tokens not logged in production (B8b).
- [x] Public login/docs only show `viajero_demo`. Remove leftover `admin_demo / Demo1234!` from workspace `DEPLOY.md`.
- [ ] Production `ADMIN_PASSWORD` / `MODERATOR_PASSWORD` ≠ public demo password.
- [x] Image upload MIME allow-list; security headers; no secrets in logs.

Details: `Forum_backend/docs/BACKEND_TASKS.md` (S1–S9) and frontend `TASKS.md` § Remaining work (F1–F25, Q1–Q8).

Open API items: S6 (ops), B10–B14 (P2), B15–B22 (P3, separate). B1 working decision remains (b): diaries = posts with photos; UI is F5 (no blog CMS).

## P2 — Improves the redesign

- [x] **B9. Top contributors**: `GET /api/users/top-contributors?period=month&limit=5` returning user, avatar, role badge and points (posts + comments + likes received).
- [ ] **B10. Bookmarks / saved posts**: `Bookmark` entity, `POST/DELETE /api/posts/{id}/bookmark`, `GET /api/users/me/bookmarks`, `bookmarkedByCurrentUser` in post DTO.
- [ ] **B11. Global search**: `GET /api/search?q=` returning posts, forums, users and countries (header search + ⌘K).
- [ ] **B12. Related discussions**: `GET /api/posts/{id}/related` (same tags/forum).
- [ ] **B13. Online count / last activity** for the replies header (optional, can be dropped).
- [ ] **B14. Reading time**: compute `readingMinutes` from content length in the post DTO (or do it in the frontend).

## P3 — New features from the mockups (separate scope)

- [ ] **B15. Travel companions** ("Compañeros de Viaje"): `Trip` entity (owner, destination, country/continent, start/end date, duration, style, budget per day, age range, group size, free spots, requirements, description, cover image, status) and `TripRequest` (user, message, status pending/accepted/rejected). Endpoints: list with filters (region, dates, style, budget, age), CRUD, request to join, accept/reject, "recently formed groups".
- [ ] **B16. Route telemetry on posts**: optional `RouteInfo` (distance km, elevation gain/loss, max altitude, difficulty, total cost, transport type, best season) and itinerary days.
- [ ] **B17. GPX upload/download** attached to posts, plus elevation profile points derived from the track.
- [ ] **B18. Badges / adventure passport**: `Badge` and `UserBadge`, rules engine (e.g. 10 routes → "Guía Verificado"), user level.
- [ ] **B19. Destination of the month**: admin-curated entity, or a seeded static entry for the demo.
- [ ] **B20. Newsletter subscription**: demo only — store the email in the DB (`POST /api/newsletter`), no email sending (no paid provider). Alternatively hide the widget.
- [ ] **B21. Weather**: call Open-Meteo (free, no API key) directly from the frontend; no backend needed. Mountain alerts are out of scope (no free reliable source).
- [ ] **B22. Trip announcements on profiles** ("Próximos Viajes") — reuse B15.

## Notes

- Add demo seed data for every new feature (companions trips, route info, badges) so the pages look complete without real users.

- Keep DTOs backwards compatible: add fields, do not rename existing ones, so `main` keeps working while the redesign lives on its branch.
- Every new endpoint needs integration tests and an update to the API docs.
- The CSRF work archived in tag `archive/backend-feature-fix` is unrelated; pick it up separately if needed.
