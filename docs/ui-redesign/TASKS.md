# UI/UX Redesign — Tasks

Branch: `feature/fix_new-ux-ui` · Reference: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) · Previous UI: `release/ui-2025-2026`

Work stays on this branch until approved, then merges to `dev` → `main` (see `AGENTS.md`).
Tick a task in the same commit that completes it.

## Phase 0 — Preparation
- [x] Create branch `feature/fix_new-ux-ui` from `dev`
- [x] Freeze current UI in `release/ui-2025-2026`
- [x] Add design reference, mockups and `AGENTS.md`
- [ ] Take baseline screenshots of current pages (Playwright) for before/after comparison
- [ ] Audit current styling: `tailwind.config.js` is not loaded by Tailwind v4 (no `@config`); list custom classes in use (`bg-secondary`, `text-accent`, …) that resolve to nothing or to defaults
- [ ] Decide on DaisyUI: remove it if unused, or disable its themes to avoid conflicts with the new tokens
- [ ] Review `ThemeContext` per-route themes (`retro`, `adventure`, `space`, `jungle`, `tech`): the new system uses one theme → simplify
- [ ] Remove `CustomCursor` if it does not fit the new editorial style (and `ForumBgPreviewPage` if unused)

## Phase 1 — Foundations (design tokens)
- [ ] Define color tokens with `@theme` in `src/index.css` (section 3 of the reference)
- [ ] Define typography tokens (font families + `text-*` sizes with line-height/weight/tracking)
- [ ] Define spacing, radius and shadow tokens (levels 1–3)
- [ ] Load Newsreader + Plus Jakarta Sans in `index.html`; remove Inter/Montserrat
- [ ] Rewrite base styles in `index.css` (body, headings, links, `::selection`, `focus-visible` ring); drop the old palette and `:root` vars
- [ ] Delete or replace `tailwind.config.js`
- [ ] Icons: decide between keeping `react-icons` (pick the closest set, e.g. `react-icons/md`) or adding Material Symbols; document the choice
- [ ] Add `prefers-reduced-motion` handling for transitions/hover scales
- [ ] Optional: dark mode tokens (not in the mockups — decide later)

## Phase 2 — Base components (`src/components/ui/`)
- [ ] `Button` (primary, secondary, ghost, icon) with sizes and loading state
- [ ] `Chip` / `FilterPill` (inactive, active, removable) and `Tag`
- [ ] `RouteBadge` (dual pill: icon+label | metric)
- [ ] `Avatar` (image or initials, tonal colors, verified badge, stack)
- [ ] `Card` (level 1 → 2 on hover) and `SectionCard` for rail widgets
- [ ] `SegmentedTabs` (accessible tablist)
- [ ] `Input`, `Select`, `Textarea`, `Checkbox`, `Radio` with focus styles
- [ ] `Breadcrumb`
- [ ] `TelemetryStats` (3-column metrics widget)
- [ ] `ElevationProfile` (SVG sparkline)
- [ ] `Modal` / `Lightbox` (focus trap, `Esc`, overlay click)
- [ ] `EmptyState`, `Skeleton` and restyled `LoadingSpinner`
- [ ] Restyle toasts (`react-hot-toast`) to the new palette
- [ ] Unit tests for the new components (Vitest + Testing Library)

## Phase 3 — Layout shell
- [ ] `Navbar`: fixed 80px header, blur background, logo + "Comunidad Global", search (xl+), segmented nav pill, "Crear Debate" CTA, notifications, language, avatar menu
- [ ] Mobile navigation (drawer/bottom sheet) — mockups only cover desktop
- [ ] Map new nav items to routes: Explorar `/`, Comunidades & Foros `/forums`, Diarios de Viaje `/blog`, Compañeros de Viaje (new, Phase 6); decide where Trivia, Mapa (`/travel`) and Mensajes go
- [ ] `Footer`: brand + manifesto card, 3 link columns, bottom bar (fix links to real routes)
- [ ] Page container helper (max-w-7xl, gutters per breakpoint) and 12-col grid utilities
- [ ] Update `Navbar.test.jsx` and link/route tests

## Phase 4 — Pages
### Home / Explore (`/`, mockup 01)
- [ ] Hero with eyebrow chip, editorial headline, multi-filter search, trending chips
- [ ] Left rail: categories ("Canales Temáticos") from `categoryService`, continents filter, responsible-travel card
- [ ] Center feed: segmented tabs (trending, recent, with photos, unanswered) wired to existing post/forum services
- [ ] Feed card variants: featured guide, question with top reply, visual diary with cover + telemetry
- [ ] Right rail: create CTA, companions preview, destination of the month, top contributors, newsletter (decide which have real data; hide the rest)
- [ ] Update `HomePage.test.jsx`

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

## Phase 6 — New features shown in mockups (need backend, separate scope)
These appear in the mockups but have no API today. Track separately; do not block the redesign on them.
- [ ] Travel companions section (trips with free spots, filters, join requests, safety tips) — new backend entities + endpoints
- [ ] Route telemetry on posts (distance, elevation, difficulty, cost) and GPX upload
- [ ] Bookmarks / saved routes
- [ ] Badges / "adventure passport" and contributor points ranking
- [ ] Destination of the month, newsletter subscription
- [ ] Weather & alerts widget (external API)
- [ ] Global search (⌘K)
