---
inclusion: auto
description: Technical stack decisions, git workflow, and project context for AGE Viewer modernization.
---

# Development Guidelines

## Technical Stack (Current)

- **Runtime:** Node.js 24.x LTS (minimum `>=24.0.0`)
- **Frontend framework:** React 19.1 (`createRoot` API, no class components)
- **State management:** Redux Toolkit 2.x + React-Redux 9.x
- **Build tool:** Vite 6.x (not Next.js — this is a client-side SPA/dashboard)
- **Design system:** IBM Carbon (`@carbon/react`) — fully migrated (antd + Bootstrap removed)
- **Backend:** Express 4.x with native ESM (no Babel, no build step) — fully migrated to TypeScript
- **TypeScript:** Active migration (Phase 6, in progress). Backend 100% TS. Frontend Redux/utilities 100% TS. Frontend components in progress (Phase 6e).
- **Container engine:** Podman (preferred). Docker is supported as an alternative. Always provide both Podman and Docker commands in docs, with Podman first.

## Git Workflow

- **Branch strategy:** `development` is the integration branch. Feature branches are created off `development` for each phase/feature.
- **Feature branches:** One per phase (e.g., `feature/phase-1-foundation`, `feature/phase-3b-react-19`)
- **PRs:** Raise a PR from feature branch → `development` for review. Do NOT merge without approval.
- **Releases:** Create git releases with release notes after each phase merges.
- **Commits:** Meaningful commit messages. Stage specific files, not `git add .`
- **Never push directly to `main` or `development`** — always go through feature branch → PR.
- **Documentation:** Update backlog and relevant docs in the same commit as code changes. Do not create separate PRs for doc updates.
- **Testing approach:** Always validate locally first (with Podman/Docker), then adapt for CI. Never push CI-only changes without local verification.

## Project Context

- Apache AGE Viewer — a graph visualization tool for PostgreSQL with AGE extension
- Modernization releases: v0.5.0 (Phase 1), v0.6.0 (Phase 2), v1.0.0 (Phases 3-4), v1.0.1 (hotfix)
- IBM-aligned: Carbon design system (fully migrated), enterprise standards
- **Current: Phase 6e — frontend component TypeScript migration (in progress)**
  - Branch: `feature/phase-6e-frontend-components-ts`
  - Done: App, pages, icons, hooks, cytoscape config, template, conf (~14 files)
  - Remaining: ~50 JSX/JS component files in `components/` and `test/`
- **Completed phases:** 1 (Node 24), 2 (ESM), 3 (Vite/React 19/Carbon), 4 (Testing), 5 (CSS layout), 6a (TS infra), 6b (type defs), 6c (backend TS), 6d (frontend Redux TS)
- **Next after 6e:** Phase 6f — strict mode, remove allowJs, update tests to TS

## Documentation & Diagrams

- **Architecture diagrams:** Mermaid (preferred). DrawIO as fallback if Mermaid is not feasible.
- **Documentation format:** Markdown in `.kiro/docs/`

## Design Decisions

- **IBM Carbon over Ant Design** — IBM alignment, accessibility standards, replaces both antd and Bootstrap
- **Vite over Next.js** — This is a client-side dashboard with no SSR/SEO needs
- **Native ESM over Babel** — Node 24 supports all modern JS features natively
- **React 19 over 18** — GA and stable, Carbon supports it, longest support window
- **Node 24 over 20/22** — Active LTS with support through Apr 2028; 20 is EOL, 22 is maintenance-only
- **RTK 2.x** — redux and redux-thunk are bundled, no separate packages needed
- **No prop-types** — React 19 doesn't enforce them; use TypeScript in Phase 5 instead
- **Environment variables** — All secrets/credentials via `.env` at project root (never hardcoded, never in subdirectories). `.env.example` documents required vars without values.
