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
- [ ] Remove each legacy alias (`midnight`, `golden`, `aqua`, `teal`, `forest`, `terracota`, `accent`, `text-*`, `primary-light/dark`, `font-display/retro`) once no component uses it
- [ ] Optional: dark mode tokens (not in the mockups — decide later)

## Phase 2 — Base components (`src/components/ui/`)
- [ ] `Button` (primary, secondary, ghost, icon) with sizes and loading state
- [ ] `Chip` / `FilterPill` (inactive, active, removable) and `Tag`
- [ ] `RouteBadge` (dual pill: icon+label | metric)
- [x] `Avatar` (image or initials, stable tonal color per name, image fallback) — `src/components/ui/Avatar.jsx`
- [ ] `Avatar` extras: verified badge overlay, avatar stack
- [x] `SectionCard` for rail widgets — `src/components/ui/SectionCard.jsx`
- [ ] Generic `Card` component (level 1 → 2 on hover)
- [x] `SegmentedTabs` (WAI-ARIA tablist with arrow/Home/End keys) — `src/components/ui/SegmentedTabs.jsx`
- [ ] `Input`, `Select`, `Textarea`, `Checkbox`, `Radio` with focus styles
- [ ] `Breadcrumb`
- [ ] `TelemetryStats` (3-column metrics widget)
- [ ] `ElevationProfile` (SVG sparkline)
- [ ] `Modal` / `Lightbox` (focus trap, `Esc`, overlay click)
- [ ] `EmptyState`, `Skeleton` and restyled `LoadingSpinner`
- [ ] Restyle toasts (`react-hot-toast`) to the new palette
- [ ] Unit tests for the new components (Vitest + Testing Library)

## Phase 3 — Layout shell
- [x] `Navbar`: sticky 80px header, blur background, logo + "Comunidad Global", segmented nav pill with active state, "Crear debate" CTA, notifications/messages with counters, language toggle, avatar menu (closes on Esc/outside click/route change)
- [ ] Header search (xl+) — needs global search endpoint (B11)
- [x] Mobile navigation: dropdown panel with links, create/messages, language and auth buttons
- [ ] Map new nav items to routes: Explorar `/`, Comunidades & Foros `/forums`, Diarios de Viaje `/blog`, Compañeros de Viaje (new). For now the nav keeps the existing sections (Inicio, Contenido, Foros, Trivia, Mi Mapa) until B1 (blog) and B15 (companions) exist
- [x] `Footer`: brand + manifesto card, 3 link columns (real routes only), bottom bar with social links
- [ ] Page container helper (max-w-7xl, gutters per breakpoint) and 12-col grid utilities
- [x] Update `Navbar.test.jsx` translation mock
- [ ] Re-run Playwright navbar/footer specs against a running backend

## Phase 4 — Pages
### Home / Explore (`/`, mockup 01)
- [x] Hero with eyebrow chip, editorial headline, search (→ `/forums?q=`), quick-access chips
- [ ] Hero interest/category filter and trending hashtags (needs public `/api/tags/popular`, currently auth-only)
- [x] Left rail: topic channels with forum counts, continents grid, responsible-travel card
- [x] Center feed: tabs "Recientes" (`/feed/explore`) and "Foros activos"
- [ ] Extra tabs (trending, with photos, unanswered) — B3
- [x] `FeedCard` redesigned as thread card (shared with `/feed`)
- [ ] Feed card variants: featured guide, question with top reply, visual diary with cover + telemetry (need B2/B4/B16)
- [x] Right rail: create/join CTA, top travelers (`/travel/ranking`), discover card (trivia, map)
- [ ] Companions preview, destination of the month, newsletter — after B15, B19, B20
- [x] Update `HomePage.test.jsx` mocks

### Forums & categories (`/forums`, `/categories`, `/forums/:id`)
- [ ] Restyle `ForumListPage`, `ForumCard`, `ForumSearch`, `CategoryListPage`, `CategoryCard`
- [ ] Restyle `ForumDetailsPage` with thread cards

### Thread / post detail (`/posts/:id`, mockup 02)
- [ ] Header band: breadcrumb, badges, title, actions (vote, save, share), author bar
- [ ] Body: restyle `PostContent`; support optional rich blocks (itinerary, budget table, gallery + lightbox, map/GPX) only where data exists
- [ ] Replies: sort pills, nested replies (`CommentList`, `CommentItems`), reply composer (`CommentForm`) with markdown toolbar
- [ ] Rail: route facts, related discussions, companions CTA (weather widget only if a data source is added)
- [ ] Restyle `PostCreatePage` / `PostEditPage` / `PostForm`, `ForumCreatePage` / `ForumEditPage` / `ForumForm`

### Profile (`/profile`, `/profile/:userId`, mockup 04)
- [ ] Cover + overlapping identity card, follow/share actions, metrics bar (`ProfileStats`)
- [ ] Left column: badges passport (decide data source), travel map card reusing `WorldMap`/`TravelStats`, gear
- [ ] Right column: accessible tabs (posts/guides, debates, upcoming trips, saved routes) with horizontal cards
- [ ] Restyle `FollowModal`, `FollowList`, `UsersPage`

### Other pages
- [ ] Auth: `LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `ResetPasswordPage`, `LoginForm`, `RegisterForm`
- [ ] Blog: `BlogHomePage`, `BlogPostPage`, `BlogCategoryPage`, `BlogSearchPage`, `BlogCard`, `BlogHero` ("Diarios de Viaje")
- [ ] Feed: `FeedPage`, `FeedCard`
- [ ] Travel map: `TravelMapPage`, `WorldMap` colors, `AddPlaceModal`, `PlacesList`, `CountrySelector`
- [ ] Trivia: home, play, infinite, leaderboard + components
- [ ] Messages & notifications: `MessagesPage`, `ChatWindow`, `ConversationList`, modals, `NotificationsPage`
- [ ] Admin & moderator dashboards
- [ ] Static pages: About, Contact, Help, NotFound

## Phase 5 — Quality
- [ ] Responsive pass at 375 / 768 / 1024 / 1280 px on every page (no horizontal scroll)
- [ ] Accessibility pass (DESIGN_SYSTEM §9): contrast, focus, labels, alt text, keyboard navigation; run axe in Playwright
- [ ] Update Playwright E2E selectors broken by the redesign
- [ ] `npm run lint`, `npm test`, `npm run build` green
- [ ] Performance: check bundle size, lazy-load heavy pages, optimise images (webp, `loading="lazy"`)
- [ ] Before/after screenshots review with the owner
- [ ] Merge to `dev`, verify deploy, then merge to `main`

## Phase 6 — New features shown in mockups (need backend)
Backend work is listed in [`BACKEND_TASKS.md`](./BACKEND_TASKS.md). Until an endpoint exists the UI hides that block (no fake data in production).
- [ ] "Diarios de Viaje": the blog API does not exist in the backend (B1) — working decision: diaries are posts with photos
- [ ] Feed tabs (trending / recent / with photos / unanswered) — B3
- [ ] Nested replies and reply sorting — B4
- [ ] Profile cover, likes received, user content tabs — B6, B7
- [ ] Top contributors, bookmarks, global search (⌘K), related discussions — B9–B12
- [ ] Travel companions section (trips, filters, join requests, safety tips) — B15
- [ ] Route telemetry, itinerary, GPX and elevation profile — B16, B17
- [ ] Badges / adventure passport — B18
- [ ] Destination of the month, newsletter (store only, no sending), weather via Open-Meteo — B19–B21

Constraint: demo project — own database, only free external APIs (see `BACKEND_TASKS.md`).
