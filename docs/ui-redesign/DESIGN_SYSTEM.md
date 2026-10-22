# Design System Reference — "Tierra & Rumbo"

Reference for the Forum Viajeros UI/UX redesign (branch `feature/fix_new-ux-ui`).
The previous interface is frozen in branch `release/ui-2025-2026`.

- Mockup screenshots: [`mockups/`](./mockups)
- Task list: [`TASKS.md`](./TASKS.md)

---

## 1. Source of truth

The design came as a `DESIGN.md` (YAML tokens + prose) and four HTML/Tailwind mockups.
They disagree in a few places. **Rule: the YAML tokens (also used by the mockups) win over the prose.**

| Topic | YAML / mockups (use this) | Prose (ignore) |
|---|---|---|
| Primary (terracotta) | `#91471c` | `#C06C3E` |
| Secondary (forest) | `#476558` | `#2D4A3E` |
| Background | `#f5fbf6` | `#FBF9F5` |
| Body text | `#171d1a` | `#1E2421` |
| Card radius | `lg = 1rem` (DESIGN.md) | mockup Tailwind config uses `xl = 0.75rem` |

Reason: `#91471c` on white gives ~6.7:1 contrast (AA for all text sizes); `#C06C3E` only reaches ~3.9:1
and fails AA for normal text, which contradicts the "accessible" goal of the system.

Radius: follow the DESIGN.md scale (`sm .25 / DEFAULT .5 / md .75 / lg 1 / xl 1.5rem`). Cards use `rounded-lg` (1rem).

---

## 2. Brand & mood

- **Organic & grounded** — earth pigments, clay paths, foliage. Human, lived-in, not sterile.
- **Editorial warmth & trust** — conversational community UI + pacing of classic travel publications.
- **Accessible & mindful** — high-contrast text, clear interactive boundaries, comfortable long reading.
- Depth comes from tonal layers and soft tinted shadows, not glassy overlays.

---

## 3. Color tokens (Material-3 style roles)

| Token | Hex | Typical use |
|---|---|---|
| `primary` | `#91471c` | Primary CTAs, active highlights, links, counters |
| `on-primary` | `#ffffff` | Text on primary |
| `primary-container` | `#b05f32` | Primary hover |
| `on-primary-container` | `#fffbff` | |
| `primary-fixed` | `#ffdbcb` | Soft terracotta chips, avatar bg, selection |
| `primary-fixed-dim` | `#ffb691` | |
| `on-primary-fixed` | `#341100` | |
| `on-primary-fixed-variant` | `#763308` | |
| `inverse-primary` | `#ffb691` | |
| `surface-tint` | `#944a1e` | |
| `secondary` | `#476558` | Active nav pill, active filter/tab, secondary buttons |
| `on-secondary` | `#ffffff` | |
| `secondary-container` | `#c9ead9` | Category badges |
| `on-secondary-container` | `#4d6b5d` | |
| `secondary-fixed` | `#c9ead9` | Highlighted hashtag/tag chips |
| `secondary-fixed-dim` | `#adcebe` | |
| `on-secondary-fixed` | `#022016` | |
| `on-secondary-fixed-variant` | `#304d40` | Secondary hover, tag text |
| `tertiary` | `#3d6355` | Accents, map/status icons |
| `on-tertiary` | `#ffffff` | |
| `tertiary-container` | `#567c6d` | |
| `on-tertiary-container` | `#f5fff8` | |
| `tertiary-fixed` | `#c2ecd9` | |
| `tertiary-fixed-dim` | `#a6cfbd` | |
| `on-tertiary-fixed` | `#002117` | |
| `on-tertiary-fixed-variant` | `#284e40` | |
| `background` / `surface` / `surface-bright` | `#f5fbf6` | Page canvas |
| `on-background` / `on-surface` | `#171d1a` | Main text |
| `on-surface-variant` | `#54433b` | Secondary text, excerpts |
| `surface-container-lowest` | `#ffffff` | Cards |
| `surface-container-low` | `#eff5f0` | Inputs, nested blocks, hero bg, footer |
| `surface-container` | `#e9efea` | Chips, hover |
| `surface-container-high` | `#e4eae5` | Counters, table header |
| `surface-container-highest` / `surface-variant` | `#dee4df` | |
| `surface-dim` | `#d5dbd6` | |
| `inverse-surface` | `#2c322f` | Image scrims (`/40`–`/85`) |
| `inverse-on-surface` | `#ecf2ed` | |
| `outline` | `#87736a` | Meta text, placeholder, icons |
| `outline-variant` | `#dac2b7` | Subtle borders/dividers |
| `error` | `#ba1a1a` | "Last spot", difficulty "hard" |
| `on-error` | `#ffffff` | |
| `error-container` | `#ffdad6` | Question badge, weather alerts |
| `on-error-container` | `#93000a` | |

Color usage rules:
- Body/label text: `on-surface` on `background`/`surface-container-lowest`.
- Primary is paired with white text only. For small badge text on light bg use `primary` (`#91471c`), never `primary-container`.
- Placeholder text: `outline`.

---

## 4. Typography

Fonts (Google Fonts):
- **Newsreader** (serif, optical sizing, italic available) — editorial headlines, thread titles, destination names.
- **Plus Jakarta Sans** (400/500/600/700) — UI, body, metadata, navigation.
- **Material Symbols Outlined** — icon set used by the mockups (the app currently uses `react-icons`; see TASKS).

| Token | Family | Size / line-height | Weight | Tracking |
|---|---|---|---|---|
| `display-lg` | Newsreader | 3.5rem / 4rem | 600 | -0.02em |
| `display-lg-mobile` | Newsreader | 2.25rem / 2.75rem | 600 | -0.01em |
| `headline-lg` | Newsreader | 2.5rem / 3rem | 600 | -0.015em |
| `headline-lg-mobile` | Newsreader | 1.75rem / 2.25rem | 600 | — |
| `headline-md` | Newsreader | 1.75rem / 2.25rem | 500 | — |
| `headline-sm` | Plus Jakarta Sans | 1.25rem / 1.75rem | 700 | — |
| `title-md` | Plus Jakarta Sans | 1.125rem / 1.5rem | 600 | — |
| `body-lg` | Plus Jakarta Sans | 1.125rem / 1.75rem | 400 | — |
| `body-md` | Plus Jakarta Sans | 1rem / 1.625rem | 400 | — |
| `body-sm` | Plus Jakarta Sans | 0.875rem / 1.375rem | 400 | — |
| `label-lg` | Plus Jakarta Sans | 0.875rem / 1.25rem | 600 | 0.01em |
| `label-md` | Plus Jakarta Sans | 0.75rem / 1rem | 600 | 0.02em |
| `caption` | Plus Jakarta Sans | 0.6875rem / 0.875rem | 500 | 0.03em |

Notes:
- Thread/card titles: Newsreader (`headline-md` for featured, `headline-sm` size for regular cards).
- Hero headline pattern: regular text + italic accent in `primary` ("Comparte el camino, *descubre el mundo.*").
- Micro-copy and metric labels: `label-md`/`caption`, often uppercase + wide tracking.

---

## 5. Spacing, layout & breakpoints

Spacing tokens: `space-xs .25rem`, `space-sm .5rem`, `space-md 1rem`, `space-lg 1.5rem`, `space-xl 2.5rem`,
`gutter-sm 1rem`, `gutter 1.5rem`, `gutter-lg 2rem`, `margin-sm 1rem`, `margin 2rem`, `margin-lg 3rem`.

| Breakpoint | Grid | Gutter | Margin | Notes |
|---|---|---|---|---|
| Desktop ≥1024px | 12 cols, max width 1280px (`max-w-7xl`) | 2rem | 3rem | Feed 8 cols + rail 4 cols (home uses 3/6/3) |
| Tablet 640–1023px | 8 cols | 1.5rem | 2rem | Side rail stacks below or becomes a drawer |
| Mobile <640px | 4 cols, single column | 1rem | 1rem | Padding compresses to `space-sm`/`space-md` |

Header: fixed, 80px (`h-20`), `bg-surface/90` + `backdrop-blur-xl`; page content starts with `pt-20`.

---

## 6. Shape & elevation

Radius: `sm .25rem`, `DEFAULT .5rem` (inputs, thumbnails, dropdowns), `md .75rem`, `lg 1rem` (cards),
`xl 1.5rem`, `full` (pills, badges, buttons, avatars).

Elevation:
| Level | Use | Style |
|---|---|---|
| 0 | Canvas | `background` |
| 1 | Cards, feed tiles | white, 1px border `outline-variant`-ish, `0 2px 8px -2px rgba(45,74,62,.05), 0 1px 3px -1px rgba(30,36,33,.03)` |
| 2 | Hovered cards, popovers | `0 10px 24px -4px rgba(45,74,62,.08), 0 4px 8px -2px rgba(30,36,33,.04)` |
| 3 | Modals, lightbox | overlay `rgba(30,36,33,.45)` + 4px blur; surface `0 20px 32px -8px rgba(30,36,33,.16)` |

Motif: speech-bubble accent in reply counters and avatars (brand dialogue mark).

---

## 7. Components

**Buttons** (all `rounded-full`)
- Primary: `bg-primary text-on-primary`, hover `bg-primary-container`, `active:scale-95`, padding `.75rem 1.5rem`.
- Secondary: `bg-secondary text-on-secondary`, hover `on-secondary-fixed-variant` / `secondary/90`.
- Ghost/tertiary: transparent, 1.5px border `secondary`, text `secondary`, hover `surface-container-low`.
- Icon button: 36–40px circle, `bg-surface-container-low`, hover `surface-container-high`.

**Chips & filter pills**
- Inactive: `bg-surface-container-high/60`, text `on-surface`.
- Active: `bg-secondary text-on-secondary`.
- Route/meta tag: `bg-secondary-fixed text-on-secondary-fixed-variant` or `bg-surface-container`, `label-md`/`caption`.

**Segmented tabs / nav** — container `bg-surface-container-low rounded-full p-1`; active item `bg-secondary text-on-secondary`.

**Thread card** — white, `rounded-lg`, padding `space-lg`, level-1 shadow → level-2 on hover.
Top row: avatar (initials circle) + handle + verified icon + timestamp/reading time, badge on the right.
Title Newsreader, 2–3 line clamped excerpt `body-sm/md`, optional photo mosaic (3 cols, `+N fotos` overlay),
hashtag chips, footer: like pill (count), replies, save, "Participar →".

**Route & adventure badge (dual pill)** — left half icon + label on `secondary`, right half metric on `surface-container` (e.g. "Ferry & Riel | Nivel Fácil", "2 plazas libres | Grupo de 4").

**Route telemetry widget** — `surface-container-low` box, 3 columns (distance / elevation gain / difficulty) with uppercase caption labels.

**Elevation profile** — inline SVG sparkline, terracotta stroke + gradient fill, waypoint dots, labels underneath.

**Inputs & search** — `bg-surface-container-low` or white, 1.5px border, focus border `primary` + 3px ring `primary/20`.
Hero search: floating white pill with "Destino o región" + "Interés del viaje" select + primary button.

**Checkbox / radio** — checkbox 4px radius, radio circle, selected fill `primary` with white check/dot.

**Avatars** — initials on tonal backgrounds (`primary-fixed`, `secondary-fixed`, `tertiary-fixed`, …), verified badge overlay.

**Breadcrumb** — `label-md`, `/` separators in `outline`, current item `on-surface` semibold.

**Data table (budget)** — header `surface-container-high` uppercase, rows `surface-container-low` with dividers, footer total in `primary`.

**Reply composer** — markdown toolbar (bold, italic, list, quote, link, attach GPX, photos), textarea `surface-container-low`, "Descartar" ghost + "Publicar respuesta" primary.

**Lightbox** — level-3 modal, image + caption, close button top-right, click on overlay closes, must trap focus and close on `Esc`.

**Footer** — `surface-container-low`, 5-col grid (brand + manifesto card spanning 2, then 3 link columns), bottom bar with copyright and accessibility links.

---

## 8. Page specs (from mockups)

### 8.1 Explore / Home — `mockups/01-explore-home.png` → route `/`
- Header nav pill: Explorar · Comunidades & Foros · Diarios de Viaje · Compañeros de Viaje; "Crear Debate" primary; notifications, language (ES), avatar.
- Hero: eyebrow chip ("Bitácora colectiva · +42.000 rutas"), Newsreader headline with italic primary accent, subtitle, floating multi-filter search, trending hashtag chips.
- 3-column grid (3/6/3):
  - Left rail: "Canales Temáticos" (emoji + name + count), "Por Continentes" grid, "Viaje Responsable" editorial card.
  - Center feed: segmented tabs (Tendencias, Recientes, Diarios con Fotos, Sin responder); featured rich card; question card with highlighted reply; visual diary card with cover image + telemetry widget.
  - Right rail: create-debate CTA, travel companions preview, destination of the month, top contributors, newsletter.

### 8.2 Thread detail — `mockups/02-thread-detail.png` → routes `/posts/:id` (and forum detail)
- Header band with gradient, breadcrumb, category badges, Newsreader title + subtitle, vote/save/share actions, author bar with telemetry (difficulty, total cost).
- 8/4 grid. Main: summary callout, day-by-day itinerary cards, elevation profile, photo gallery + lightbox, budget table, map card with GPX download, moderation footer, replies section (sort pills, nested replies), reply composer.
- Rail: route fact sheet, weather & alerts, related discussions, travel companions CTA (secondary bg).

### 8.3 Travel companions — `mockups/03-travel-companions.png` → **new section** (no route yet)
- Editorial intro + avatar stack/social proof; filter matrix (region, dates, style, budget/day, age group) + active filter chips + reset.
- 8/4 grid. Feed of trip cards (owner, dual badge with free spots, destination/date line, title, photo or route profile, description, tags, save + request-to-join CTA), pagination.
- Rail: "publish my trip" primary gradient CTA, safety tips numbered list, affinity test card, recently formed groups.
- ⚠ Requires backend support (trips, requests). See TASKS.

### 8.4 Traveler profile — `mockups/04-traveler-profile.png` → routes `/profile`, `/profile/:userId`
- Full-width cover photo with location chip; overlapping identity card (avatar with verified badge, name, contributor badge, handle, member since, bio, Share/Connect) and 4-metric bar.
- 5/7 grid. Left: adventure passport (badges grid, progress), territory map card (countries/pins), usual gear. Right: tabs (Diaries & Guides, Active Debates, Upcoming Trips, Saved Routes) with horizontal cards.

---

## 9. Accessibility checklist (WCAG 2.1 AA)

- Text contrast ≥ 4.5:1 (≥ 3:1 for large text and UI boundaries). `outline` (#87736a) is ~4.49:1 on white and lower on `background` — it fails AA for small text, so the mockups' use of it for captions/meta must switch to `on-surface-variant` (#54433b); keep `outline` for icons, placeholders and borders.
- Never remove focus outlines without a visible `focus-visible` ring (`ring-2 ring-primary/40`).
- Icon-only buttons need `aria-label`; decorative icons `aria-hidden="true"`.
- Images need real `alt` text (the mockups use `data-alt`, which is not accessible).
- Tabs use `role="tablist"`/`tab`/`tabpanel` + `aria-selected`; current nav item `aria-current="page"`.
- Lightbox/modals: focus trap, `Esc` to close, return focus to trigger.
- Respect `prefers-reduced-motion` for hover scales and transitions.
- Do not hide scrollbars globally (mockups use `::-webkit-scrollbar{display:none}` — do not copy it).

---

## 10. Implementation notes for this codebase

- Stack: React 19 + Vite + Tailwind CSS v4 (`@tailwindcss/vite`), `react-icons`, DaisyUI installed.
- Tailwind v4 does **not** read `tailwind.config.js` unless `@config` is declared; tokens should be defined with `@theme` in `src/index.css`
  (e.g. `--color-primary: #91471c; --font-headline: "Newsreader", serif; --text-headline-md: 1.75rem; ...`).
- Do not use the Tailwind Play CDN (`cdn.tailwindcss.com`) from the mockups; translate the classes to the build setup.
- Mockup images are hosted on `lh3.googleusercontent.com` placeholders — replace with app assets or user content.
- Keep copy in Spanish (i18n via `LanguageContext`), code identifiers in English.
