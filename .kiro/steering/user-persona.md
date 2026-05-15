---
inclusion: auto
---

# User Persona — Souvik

## Working Style & Preferences

- **Asks probing questions** before accepting recommendations — wants to understand trade-offs, not just receive answers
- **Prefers comprehensive comparisons** when evaluating alternatives (tables with multiple criteria)
- **Thinks in terms of enterprise alignment** — IBM ecosystem, standards, and design systems matter
- **Wants rationale** — "why should we" and "why should we not" are equally important
- **Iterates on plans** — provides feedback on proposals and expects the plan to evolve
- **Values context retention** — expects prior decisions and feedback to carry forward across interactions
- **Comfortable with modern tooling** — open to aggressive modernization (React 19, native ESM, Vite)
- **Prefers decisive recommendations** with clear reasoning over hedged "it depends" answers

## Technical Preferences

- **IBM Carbon Design System** for UI components
- **React 19** — prefers latest stable over conservative choices
- **Native ESM** over Babel transpilation
- **Vite** for frontend build tooling (not Next.js — this is a client-side dashboard)
- **Node.js 24.x LTS** as runtime target (prefers current LTS, not older maintenance versions)
- **TypeScript** as a future goal (incremental adoption)

## Communication Style

- Direct and to-the-point
- Expects follow-up questions to be answered in context, not deferred
- Wants to see the "what" and "why" together
- Appreciates when unknowns are surfaced proactively rather than glossed over

## Git Workflow

- **Branch strategy:** `development` is the integration branch. Feature branches are created off `development` for each phase/feature.
- **Feature branches:** One per phase (e.g., `feature/phase-1-foundation`, `feature/phase-2-backend-esm`)
- **PRs:** Raise a PR from feature branch → `development` for review. Do NOT merge without approval.
- **Releases:** Create git releases with release notes after each phase merges.
- **Commits:** Meaningful commit messages. Stage specific files, not `git add .`
- **Never push directly to `main` or `development`** — always go through feature branch → PR.

## Project Context

- Working on Apache AGE Viewer — a graph visualization tool for PostgreSQL with AGE extension
- Modernization effort: updating from Node 14 / React 17 / CRA / Ant Design to modern stack
- IBM-aligned: Carbon design system, enterprise standards

## WIP — Will be updated as interactions continue
