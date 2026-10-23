# UI/UX Redesign — Tasks

Branch: `feature/fix_new-ux-ui` · Reference: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) · Backend: [`BACKEND_TASKS.md`](./BACKEND_TASKS.md) · Previous UI: `release/ui-2025-2026`

Work stays on this branch until approved, then merges to `dev` → `main` (see `AGENTS.md`).
Tick a task in the same commit that completes it.

## Phase 0 — Preparation
- [x] Create branch `feature/fix_new-ux-ui` from `dev`
- [x] Freeze current UI in `release/ui-2025-2026`
- [x] Add design reference, mockups and `AGENTS.md`
- [x] Baseline: build OK, 507 unit tests passing, lint clean (2026-10-22)
- [x] Audit current styling: `tailwind.config.js` was ignored by Tailwind v4 (no `@config`), so ~800 custom color classes (`text-midnight`, `bg-golden`, `text-text`…) generated no CSS; only ~20 hand-written ones in `index.css` worked
- [x] Tailwind setup: v4.1.7 installed and working through `@tailwindcss/vite`; removed the redundant PostCSS pipeline (`postcss.config.cjs`, `@tailwindcss/postcss`, `autoprefixer`)
- [x] Remove unused deps: DaisyUI and `@tailwindcss/forms` (never loaded), self-referencing `forum` dependency
- [x] Remove unused `CustomCursor` and `ForumBgPreviewPage`
- [x] Simplify `ThemeContext`: removed per-route themes (`theme-retro`, `theme-space`…, no CSS existed); only the dark-mode preference remains
- [ ] Baseline screenshots of current pages (Playwright) for before/after comparison — the old UI can also be checked out from `release/ui-2025-2026`

## Phase 1 — Foundations (design tokens)
- [x] Define color tokens with `@theme` in `src/index.css` (section 3 of the reference)
- [x] Define typography tokens (`font-headline`, `font-body`, `text-display-lg` … `text-caption` with line-height/weight/tracking)
- [x] Define spacing (`p-space-lg`, `gap-gutter`…), radius (`rounded-base` = .5rem, `lg` = 1rem) and shadow tokens (`shadow-level-1..3`)
- [x] Load Newsreader + Plus Jakarta Sans in `index.html`; remove Inter/Montserrat
- [x] Rewrite base styles in `@layer base` (body, headings, links, inputs, `::selection`, `focus-visible` ring) and restyle shared `.btn`, `.card`, `.badge` in `@layer components`
- [x] Delete `tailwind.config.js`
- [x] Map legacy palette names onto the new tokens (temporary aliases at the end of `@theme`)
- [x] Add `prefers-reduced-motion` handling
- [x] Icons: keep `react-icons` and use the Material Design set (`react-icons/md`) to match the mockups; no icon font (avoids extra font download and FOUT)
- [x] Remove legacy aliases (all components migrated with an automated class mapping)
- [ ] Optional: dark mode tokens (not in the mockups — decide later)

## Phase 2 — Base components (`src/components/ui/`)
- [x] `Button` (primary, secondary, ghost, icon) with sizes and loading state — `src/components/ui/Button.jsx`
- [x] `Chip` / `FilterPill` (inactive, active, removable) and `Tag` — `src/components/ui/Chip.jsx`
- [x] `RouteBadge` (dual pill: icon+label | metric) — `src/components/ui/RouteBadge.jsx`
- [x] `Avatar` (image or initials, stable tonal color per name, image fallback) — `src/components/ui/Avatar.jsx`
- [x] `Avatar` extras: verified badge overlay, avatar stack — `verified` + `AvatarStack` in `src/components/ui/Avatar.jsx`
- [x] `SectionCard` for rail widgets — `src/components/ui/SectionCard.jsx`
- [x] Generic `Card` component (level 1 → 2 on hover) — `src/components/ui/Card.jsx`
- [x] `SegmentedTabs` (WAI-ARIA tablist with arrow/Home/End keys) — `src/components/ui/SegmentedTabs.jsx`
- [x] `Input`, `Select`, `Textarea`, `Checkbox`, `Radio` with focus styles — `src/components/ui/Input.jsx`, `Checkbox.jsx`, `Radio.jsx`
- [x] `Breadcrumb` — `src/components/ui/Breadcrumb.jsx` (used on post and forum details)
- [x] `TelemetryStats` (3-column metrics widget) — `src/components/ui/TelemetryStats.jsx`
- [x] `ElevationProfile` (SVG sparkline) — `src/components/ui/ElevationProfile.jsx`
- [x] `Modal` (role=dialog, labelled title, Esc/overlay close, focus trap and restore) — used by trivia dialogs
- [ ] Lightbox for post galleries (needs post images in the API, B2)
- [x] `EmptyState`, `Skeleton` and restyled `LoadingSpinner` — `EmptyState.jsx`, `Skeleton.jsx`, `common/LoadingSpinner.jsx`
- [x] Restyle toasts (`react-hot-toast`) to the new palette (inverse-surface snackbar, no per-screen overrides)
- [x] Unit tests for the new components (Vitest + Testing Library) — lightbox still pending with B2

## Phase 3 — Layout shell
- [x] `Navbar`: sticky 80px header, blur background, logo + "Comunidad Global", segmented nav pill with active state, "Crear debate" CTA, notifications/messages with counters, language toggle, avatar menu (closes on Esc/outside click/route change)
- [ ] Header search (xl+) — needs global search endpoint (B11)
- [x] Mobile navigation: dropdown panel with links, create/messages, language and auth buttons
- [ ] Map new nav items to routes: Explorar `/`, Comunidades & Foros `/forums`, Diarios de Viaje `/blog`, Compañeros de Viaje (new). For now the nav keeps the existing sections (Inicio, Contenido, Foros, Trivia, Mi Mapa) until B1 (blog) and B15 (companions) exist
- [x] `Footer`: brand + manifesto card, 3 link columns (real routes only), bottom bar with social links
- [x] Page container helper (max-w-7xl, gutters per breakpoint) and 12-col grid utilities — `PageContainer.jsx`, `.layout-grid`
- [x] Update `Navbar.test.jsx` translation mock
- [ ] Re-run Playwright navbar/footer specs against a running backend

## Phase 4 — Pages
### Home / Explore (`/`, mockup 01)
- [x] Hero with eyebrow chip, editorial headline, search (→ `/forums?q=`), quick-access chips
- [ ] Hero interest/category filter and trending hashtags (needs public `/api/tags/popular`, currently auth-only)
- [x] Left rail: topic channels with forum counts, continents grid, responsible-travel card
- [x] Center feed: tabs Recientes, Tendencia, Con fotos, Sin respuesta and Foros activos (`/feed/explore` + B3 filters)
- [x] Extra tabs (trending, with photos, unanswered) — API ready (B3); UI wired on home and `/feed`
- [x] `FeedCard` redesigned as thread card (shared with `/feed`)
- [ ] Feed card variants: featured guide, question with top reply, visual diary with cover + telemetry (need B2/B4/B16)
- [x] Right rail: create/join CTA, top travelers (`/travel/ranking`), discover card (trivia, map)
- [ ] Companions preview, destination of the month, newsletter — after B15, B19, B20
- [x] Update `HomePage.test.jsx` mocks

### Forums & categories (`/forums`, `/categories`, `/forums/:id`)
- [x] Restyle `ForumListPage`, `ForumCard`, `ForumSearch`, `CategoryListPage`, `CategoryCard`, `CategoryList`
- [x] Restyle `ForumDetailsPage` with thread cards (`PostCard`, `PostList`)

### Thread / post detail (`/posts/:id`, mockup 02)
- [x] Header band: breadcrumb (forum + category), tags, title, actions (like, share, edit, delete), author bar
- [ ] Save/bookmark action — B10
- [x] Body: restyle `PostContent`
- [ ] Rich blocks (itinerary, budget table, gallery + lightbox, map/GPX) — need post images in the DTO (B2) and route info (B16/B17)
- [x] Replies: sort pills, comment cards with thread-author badge, reply composer
- [ ] Nested replies — B4; markdown toolbar (content is plain text today)
- [x] Rail: thread facts and more posts from the same forum
- [ ] Weather widget (Open-Meteo) and companions CTA — B15, B21
- [x] Restyle `PostCreatePage` / `PostEditPage` / `PostForm`, `ForumCreatePage` / `ForumEditPage` / `ForumForm` (shared `FormPageLayout`)

### Profile (`/profile`, `/profile/:userId`, mockup 04)
- [x] Cover + overlapping identity card, follow/edit actions, metrics bar
- [ ] Custom cover upload — B6
- [x] Left column: traveler passport (badges/level from travel stats) and territory card
- [ ] Mini world map in the territory card (reuse `WorldMap`)
- [x] Right column: accessible tabs (posts, forums, edit profile, password, messages)
- [ ] Upcoming trips and saved routes tabs — B15, B10
- [ ] Other users' posts use a client-side filter of the latest 100 posts until B7 exists
- [ ] Restyle `FollowModal`, `FollowList`, `UsersPage`

### Other pages
- [x] Auth: `LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `ResetPasswordPage`, `LoginForm`, `RegisterForm` (shared `AuthLayout` and `AuthStatus`; demo note on password reset)
- [x] Blog pages migrated to tokens (hero readable again)
- [ ] Blog: decide B1 (blog API missing) before a deeper redesign of "Diarios de Viaje"
- [x] Feed: `FeedPage`, `FeedCard`
- [x] Travel map: `TravelMapPage`, `WorldMap` colors, `PlacesList`
- [x] Travel: `AddPlaceModal` layout fixed (native dialog did not cover the viewport), `CountrySelector` width
- [ ] Travel: review `TravelStats` with real data
- [x] Trivia home
- [x] Trivia: play, infinite, leaderboard, summary and question tiles (light surfaces, AA contrast, palette option tones)
- [x] Messages & notifications migrated to tokens (checked visually; empty states)
- [ ] Messages: review chat bubbles and modals with real conversations
- [x] Admin & moderator dashboards (tables and modals migrated automatically, not reviewed with real data)
- [x] Static pages: About, Contact, Help, NotFound (shared `ContentPageLayout`)

## Bugs found and fixed during the redesign
- [x] Comments showed "unknown user" and authors could not edit: API sends flat `userId/username/userAvatar`
- [x] Comment edit/delete crashed: `CommentList` passed `onDeleted` instead of `onDelete`/`onUpdate`
- [x] `hasRole('ADMIN')` never matched backend `ROLE_ADMIN` → admins/moderators had no post actions
- [x] Post authors could not edit their posts (`author.id` instead of `createdBy`)
- [x] Forum tags rendered empty (API sends strings, UI expected `{id, name}`)
- [x] `LikeButton` crashed the page on a partial API response
- [x] Profile "Mis foros"/"Mis publicaciones" rendered all forums / nothing
- [x] Profile edit never saved (sent firstName/lastName/bio; API needs fullName/biography/location)
- [x] Inputs without `type` attribute had no base styles
- [x] Editing a post opened an empty form and saving created a new post (`PostForm` never received `postId`)
- [x] Undefined `ocean/earth/light/dark` classes aliased to the new palette
- [x] Travel map never colored visited countries (wrong GeoJSON property names)
- [x] Semantic `success/warning/info` classes were undefined
- [x] Trivia summary and dark trivia screens had ~2:1 text contrast after the palette migration
- [x] Touch targets of 20-28px (segmented tabs, like, follow, share)
- [x] Trivia dialogs had no dialog semantics; `toast.info` (nonexistent) threw at runtime
- [x] Hard-coded hex colors left after the automated migration
- [x] Forum authors cannot edit their forums until the API sends `createdBy` — B2b

## Local environment for E2E
- Backend: `docker compose --env-file .env.docker up -d` in `Forum_backend` (`.env.docker` is git-ignored; see `.env.docker.example`).
  If a local PostgreSQL already uses port 5432, drop the `db` port mapping with a local override (`ports: !reset []`).
- Demo forums/posts load on profile `local` after B8c/B8d. Compose sets `SPRING_PROFILES_ACTIVE=local` (see `.env.docker.example`).
- Run E2E with `E2E_DEMO_USERNAME/PASSWORD` and `E2E_ADMIN_USERNAME/PASSWORD` set. The backend allows 5 logins per minute,
  so wait about a minute between full runs.

## Phase 5 — Quality
- [ ] Responsive pass at 375 / 768 / 1024 / 1280 px on every page (no horizontal scroll)
- [ ] Accessibility pass (DESIGN_SYSTEM §9): contrast, focus, labels, alt text, keyboard navigation; run axe in Playwright
- [x] Update Playwright E2E selectors broken by the redesign; outdated specs for nonexistent pages (/dashboard, /trivia/history, /travel/ranking) rewritten or removed
- [ ] `npm run lint`, `npm test`, `npm run build` green
- [ ] Performance: check bundle size, lazy-load heavy pages, optimise images (webp, `loading="lazy"`)
- [ ] Before/after screenshots review with the owner
- [ ] Merge to `dev`, verify deploy, then merge to `main`

## Phase 6 — New features shown in mockups (need backend)
Backend work is listed in [`BACKEND_TASKS.md`](./BACKEND_TASKS.md). Until an endpoint exists the UI hides that block (no fake data in production).
- [ ] "Diarios de Viaje": the blog API does not exist in the backend (B1) — working decision: diaries are posts with photos
- [x] Feed tabs (trending / recent / with photos / unanswered) — B3
- [ ] Nested replies and reply sorting — B4
- [ ] Profile cover, likes received, user content tabs — B6, B7
- [ ] Top contributors, bookmarks, global search (⌘K), related discussions — B9–B12
- [ ] Travel companions section (trips, filters, join requests, safety tips) — B15
- [ ] Route telemetry, itinerary, GPX and elevation profile — B16, B17
- [ ] Badges / adventure passport — B18
- [ ] Destination of the month, newsletter (store only, no sending), weather via Open-Meteo — B19–B21

Constraint: demo project — own database, only free external APIs (see `BACKEND_TASKS.md`).
