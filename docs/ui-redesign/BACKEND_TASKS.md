# UI/UX Redesign — Backend Tasks

Backend repo: `miskybox/Forum_backend` (Spring Boot). This list covers what the new interface needs from the API.
Work on a backend branch `feature/new-ux-ui-api` and follow the same rules as the frontend (`AGENTS.md`).

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

- [ ] **B1. Blog API is missing.** The frontend `blogService` calls `/api/blog/*` (categories, posts, slugs, search) but the backend has no blog controller, so the "Diarios de Viaje" section cannot work. Decide:
  - (a) implement `BlogPost`/`BlogCategory` entities and `/api/blog/*` endpoints matching `src/services/blogService.js`, or
  - (b) drop the separate blog and model "travel diaries" as posts with images (filter `hasImages=true`, see B3).
  - **Working decision: (b)** — less code, one content model, fits the demo. Revisit if a real blog is needed.
- [ ] **B2. Enrich `PostResponseDTO`** so cards render without N+1 calls:
  `likeCount`, `likedByCurrentUser`, `authorAvatarUrl`, `forumTitle`, `categoryId`, `categoryName`,
  `imageUrls` (or `coverImageUrl` + `imageCount`), `lastCommentAt`.
- [ ] **B2b. Enrich `ForumResponseDTO`**: `createdBy` (user id), `creatorUsername`, `creatorAvatarUrl`, `categoryName`. Without `createdBy` the frontend cannot tell whether the current user owns a forum, so forum authors cannot edit or delete their own forums (only admins/moderators can).
- [ ] **B3. Post listing filters and sorting** on `GET /api/posts` (and `/api/feed/explore`):
  `sort=trending|recent|top`, `unanswered=true` (commentCount = 0), `hasImages=true`, `categoryId`, `continent`, `tag`, `q`.
  Trending = weighted likes + comments in the last 7 days.
- [ ] **B4. Comment replies.** Add `parentId` to `Comment` (one nesting level), return replies grouped in `GET /api/comments/post/{postId}`, add `sort=top|chronological`. Optional: likes on comments (mockup shows "18 Me gusta" on replies).
- [ ] **B5. Category metadata** for the "Canales Temáticos" list: `icon` (emoji or icon key) and `postCount` in `GET /api/categories` (`forumCount` already exists).
- [ ] **B5b. Public popular tags**: allow anonymous `GET /api/tags/popular` (trending hashtags on the home hero).
- [ ] **B6. Profile header data** in `GET /api/users/{id}`: `coverImageUrl` (+ upload endpoint), `likesReceived`, `countriesVisited` (from travel stats), `memberSince` (already `createdAt`). Add `PUT /api/users/{id}/cover`.
- [ ] **B6b. Avatar upload**: `POST /api/users/{id}/avatar` (multipart, stored like post images). The old profile form had a picker that never uploaded anything.
- [ ] **B7. Posts and forums by user** with pagination for profile tabs: `GET /api/posts/user/{userId}` and `GET /api/forums/user/{userId}` (current `/user` only returns the logged-in user's content).
- [ ] **B8. Breadcrumb data** in `GET /api/posts/{id}`: forum id/title and category id/name (covered by B2).

## P2 — Improves the redesign

- [ ] **B9. Top contributors**: `GET /api/users/top-contributors?period=month&limit=5` returning user, avatar, role badge and points (posts + comments + likes received).
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
