# AGENTS.md

Guidelines for humans and AI agents working on this repository (Forum Viajeros — frontend).

## Project

- React 19 + Vite + Tailwind CSS v4, React Router 7, Vitest + Testing Library, Playwright (E2E).
- Backend lives in a separate repo: `miskybox/Forum_backend` (Spring Boot).
- Single-owner project: **no pull requests**. Changes are merged locally and pushed.

## Language

- **Code is always in English**: identifiers, file names, comments, test names, commit messages, branch names.
- User-facing copy stays in Spanish (or goes through `LanguageContext` translations).
- Documentation may be in English or Spanish; new technical docs default to English.

## Branching

| Branch | Purpose |
|---|---|
| `main` | Production. Only receives tested merges from `dev`. |
| `dev` | Integration branch. Receives finished feature branches. |
| `feature/<name>` | Work in progress. Branch from `dev`. |
| `release/ui-2025-2026` | Frozen snapshot of the previous UI. Never commit to it. |

Current work: `feature/fix_new-ux-ui` (UI/UX redesign). All redesign changes stay on that branch
until the owner approves them; then merge into `dev`, and later `dev` into `main`.

Merge flow (no PRs):
```bash
git checkout dev && git merge --no-ff feature/<name> && git push
git checkout main && git merge --no-ff dev && git push
```
Never force-push `main` or `dev`. Never rewrite published history.

## Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/), in English, imperative mood:

```
<type>(<optional scope>): <short summary, lowercase, no trailing period, ≤ 72 chars>

<optional body: what and why, wrapped at 72 chars>
```

Types: `feat`, `fix`, `refactor`, `style` (formatting only), `docs`, `test`, `chore`, `build`, `ci`, `perf`, `revert`.

Suggested scopes: `ui`, `theme`, `layout`, `nav`, `home`, `forum`, `post`, `profile`, `travel`, `trivia`, `blog`, `auth`, `a11y`, `deps`.

Examples:
```
feat(theme): add Tierra & Rumbo design tokens with @theme
refactor(nav): rebuild header with segmented navigation pill
fix(a11y): add aria-labels to icon-only buttons in post card
docs(ui): add design system reference for the redesign
```

Rules:
- One logical change per commit; keep the app building at every commit.
- Do not commit secrets (`.env`), build output (`dist/`), test reports or `node_modules/`.
- Do not mix unrelated refactors with feature work.

## Before committing

```bash
npm run lint
npm test
npm run build
```
Run `npm run test:e2e` for changes that affect navigation, auth or page layout.

## UI redesign references

- Design system: [`docs/ui-redesign/DESIGN_SYSTEM.md`](docs/ui-redesign/DESIGN_SYSTEM.md)
- Tasks: [`docs/ui-redesign/TASKS.md`](docs/ui-redesign/TASKS.md)
- Mockups: [`docs/ui-redesign/mockups/`](docs/ui-redesign/mockups)

Tick tasks in `TASKS.md` in the same commit that completes them.
