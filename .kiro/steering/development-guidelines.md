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
- **Design system:** IBM Carbon (`@carbon/react`) — migration in progress, currently antd 4
- **Backend:** Express 4.x with native ESM (no Babel, no build step)
- **TypeScript:** Future goal (incremental adoption)

## Git Workflow

- **Branch strategy:** `development` is the integration branch. Feature branches are created off `development` for each phase/feature.
- **Feature branches:** One per phase (e.g., `feature/phase-1-foundation`, `feature/phase-3b-react-19`)
- **PRs:** Raise a PR from feature branch → `development` for review. Do NOT merge without approval.
- **Releases:** Create git releases with release notes after each phase merges.
- **Commits:** Meaningful commit messages. Stage specific files, not `git add .`
- **Never push directly to `main` or `development`** — always go through feature branch → PR.
- **Documentation:** Update backlog and relevant docs in the same commit as code changes. Do not create separate PRs for doc updates.

## Project Context

- Apache AGE Viewer — a graph visualization tool for PostgreSQL with AGE extension
- Modernization effort in progress (Phases 1, 2, 3a, 3b complete)
- IBM-aligned: Carbon design system, enterprise standards
- Next up: Phase 3c (IBM Carbon migration), Phase 3d (axios, CodeMirror updates)

## Design Decisions

- **IBM Carbon over Ant Design** — IBM alignment, accessibility standards, replaces both antd and Bootstrap
- **Vite over Next.js** — This is a client-side dashboard with no SSR/SEO needs
- **Native ESM over Babel** — Node 24 supports all modern JS features natively
- **React 19 over 18** — GA and stable, Carbon supports it, longest support window
- **Node 24 over 20/22** — Active LTS with support through Apr 2028; 20 is EOL, 22 is maintenance-only
- **RTK 2.x** — redux and redux-thunk are bundled, no separate packages needed
- **No prop-types** — React 19 doesn't enforce them; use TypeScript in Phase 5 instead
