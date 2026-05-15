---
inclusion: auto
---

# Development Guidelines

## Technical Stack

- **Runtime:** Node.js 24.x LTS (minimum `>=24.0.0`)
- **Frontend framework:** React 19
- **Build tool:** Vite (not Next.js — this is a client-side SPA/dashboard)
- **Design system:** IBM Carbon (`@carbon/react`)
- **Backend:** Express.js with native ESM (no Babel)
- **TypeScript:** Future goal (incremental adoption)

## Git Workflow

- **Branch strategy:** `development` is the integration branch. Feature branches are created off `development` for each phase/feature.
- **Feature branches:** One per phase (e.g., `feature/phase-1-foundation`, `feature/phase-2-backend-esm`)
- **PRs:** Raise a PR from feature branch → `development` for review. Do NOT merge without approval.
- **Releases:** Create git releases with release notes after each phase merges.
- **Commits:** Meaningful commit messages. Stage specific files, not `git add .`
- **Never push directly to `main` or `development`** — always go through feature branch → PR.

## Project Context

- Apache AGE Viewer — a graph visualization tool for PostgreSQL with AGE extension
- Modernization effort: updating from Node 14 / React 17 / CRA / Ant Design to modern stack
- IBM-aligned: Carbon design system, enterprise standards

## Design Decisions

- **IBM Carbon over Ant Design** — IBM alignment, accessibility standards, replaces both antd and Bootstrap
- **Vite over Next.js** — This is a client-side dashboard with no SSR/SEO needs
- **Native ESM over Babel** — Node 24 supports all modern JS features natively
- **React 19 over 18** — GA and stable, Carbon supports it, longest support window
- **Node 24 over 20/22** — Active LTS with support through Apr 2028; 20 is EOL, 22 is maintenance-only
