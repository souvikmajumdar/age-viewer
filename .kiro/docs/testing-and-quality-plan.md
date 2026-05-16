# Testing & Quality Plan

**Date:** May 16, 2026  
**Context:** Post-Phase 3 assessment. The modernization stack is in place (Node 24, React 19, Vite, Carbon, ESM). Now we need to establish quality infrastructure before Phase 5 (TypeScript).

---

## Current State Assessment

### What Exists

| Area | Coverage | Details |
|------|----------|---------|
| Backend unit tests | ~5% | 6 tests: AGE parsing (5) + object serialization (1) |
| Backend integration tests | ~10% | 1 test file: graph creation via CSV (requires PostgreSQL) |
| Frontend unit tests | **0%** | No test runner, no test files, no testing libraries |
| Frontend component tests | **0%** | Nothing |
| E2E tests | **0%** | Nothing |
| Linting (frontend) | Partial | ESLint 7 with Airbnb config (outdated, not enforced in CI) |
| Linting (backend) | **None** | No ESLint configured |
| Formatting | None | No Prettier config |
| Type checking | None | No TypeScript |

### What's NOT Tested (Critical Gaps)

**Backend:**
- API endpoint responses (connect, disconnect, metadata, cypher execution)
- Error handling (invalid queries, connection failures, auth errors)
- Session management (session creation, isolation between users)
- Middleware chain (CORS, session, body parsing)
- SQL query builder logic
- Database service methods (parseMeta, getPropertyKeys, getRole)

**Frontend:**
- Redux slices (reducers, async thunks, selectors)
- Component rendering (any of the 30+ components)
- User interactions (form submission, graph filtering, query execution)
- Notification system (useNotification hook)
- Cookie utility functions
- Graph visualization behavior

---

## Recommended Strategy: Testing Trophy

Based on current best practices (2025/2026), we'll follow the **Testing Trophy** pattern rather than the traditional pyramid — emphasizing integration tests that give the most confidence per line of test code:

```
        ╭─────────╮
        │  E2E    │  ← 3-5 critical user flows
        ╰─────────╯
      ╭─────────────╮
      │ Integration │  ← Most tests here (API + component)
      ╰─────────────╯
    ╭─────────────────╮
    │   Unit Tests    │  ← Pure logic, utilities, reducers
    ╰─────────────────╯
  ╭─────────────────────╮
  │   Static Analysis   │  ← TypeScript + ESLint (Phase 5)
  ╰─────────────────────╯
```

---

## Tooling Choices

| Tool | Purpose | Why |
|------|---------|-----|
| **Vitest** | Test runner (both frontend + backend) | Native Vite integration, ESM-first, fast, compatible with Mocha-style API |
| **React Testing Library** | Frontend component testing | User-centric, Carbon-compatible, industry standard |
| **MSW (Mock Service Worker)** | API mocking for frontend tests | Intercepts fetch calls, no server needed |
| **Supertest** | Backend API integration tests | Already installed, works with Express |
| **Playwright** | E2E testing | Cross-browser, fast, reliable, IBM-recommended |
| **c8 / istanbul** | Code coverage | Built into Vitest |

---

## Phase 4 (Revised): Testing & Quality

### 4a: Test Infrastructure Setup
- [ ] Install Vitest + jsdom for frontend: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`, `msw`
- [ ] Add `vitest.config.js` for frontend (extends vite.config.js)
- [ ] Add Vitest to backend (replace Mocha): update `backend/package.json`
- [ ] Migrate existing backend tests from Mocha → Vitest syntax
- [ ] Add `test` scripts to both package.json files
- [ ] Add coverage reporting configuration
- [ ] Add test commands to CI workflow

### 4b: Backend Unit Tests
- [ ] `services/cypherService.js` — createResult, convertVertex, convertEdge, convertPath
- [ ] `services/databaseService.js` — parseMeta, graphNameInitialize, isConnected
- [ ] `services/sessionService.js` — put, get
- [ ] `models/QueryBuilder.js` — query generation
- [ ] `models/GraphCreator.js` — parseData, createNode, createEdge (mock papaparse)
- [ ] `tools/AGEParser.js` — (already tested, migrate to Vitest)
- [ ] `util/ObjectExtras.js` — (already tested, migrate to Vitest)
- [ ] `tools/SQLFlavorManager.js` — getQuery with different versions

### 4c: Backend Integration Tests (API)
- [ ] `POST /api/v1/db/connect` — success, invalid credentials, already connected
- [ ] `GET /api/v1/db` — connected status, disconnected status
- [ ] `GET /api/v1/db/disconnect` — success, not connected
- [ ] `POST /api/v1/db/meta` — success, not connected
- [ ] `POST /api/v1/cypher` — success, error query, not connected
- [ ] `POST /api/v1/cypher/init` — CSV upload, invalid files
- [ ] `GET /api/v1/miscellaneous` — keyword list
- [ ] Error handler middleware — 500 responses, error format
- [ ] Session isolation — two sessions don't share state

### 4d: Frontend Unit Tests (Redux + Utilities)
- [ ] `features/frame/FrameSlice.js` — addFrame, removeFrame, pinFrame, trimFrame
- [ ] `features/cypher/CypherSlice.js` — reducers, fulfilled/rejected/pending states
- [ ] `features/database/DatabaseSlice.js` — connect/disconnect state transitions
- [ ] `features/database/MetadataSlice.js` — getMetaData, changeCurrentGraph
- [ ] `features/alert/AlertSlice.js` — addAlert, removeAlert
- [ ] `features/cookie/CookieUtil.js` — loadFromCookie, saveToCookie
- [ ] `hooks/useNotification.jsx` — success/error/warning/info, auto-dismiss

### 4e: Frontend Component Tests
- [ ] `ServerConnectFrame` — form submission, validation, dispatch
- [ ] `Alert` — renders correct notification type based on alertName
- [ ] `CypherResultTable` — renders table with columns/rows, handles filter
- [ ] `Frame` — expand/collapse, close confirmation, fullscreen toggle
- [ ] `GraphFilterModal` — add/remove filters, submit, error notification
- [ ] `SidebarHome` — node/edge/property lists, graph selection
- [ ] `BuilderContainer` — query building, graph selection, submit
- [ ] `CodeMirrorWrapper` — value changes, keyboard shortcuts

### 4f: E2E Tests (Playwright)
- [ ] Install Playwright + configure
- [ ] **Flow 1:** Connect to database → verify status frame
- [ ] **Flow 2:** Execute Cypher query → verify graph visualization
- [ ] **Flow 3:** Create graph from CSV → verify success notification
- [ ] **Flow 4:** Filter graph results → verify table/graph updates
- [ ] **Flow 5:** Disconnect → verify disconnect frame
- [ ] Docker Compose for test environment (PostgreSQL + AGE)
- [ ] Add E2E to CI (separate job, runs after unit/integration)

### 4g: Code Quality & Linting
- [ ] Update ESLint to 9.x with flat config (frontend)
- [ ] Add ESLint to backend (same config style)
- [ ] Add Prettier config (`.prettierrc`) for consistent formatting
- [ ] Add `lint` and `format` scripts
- [ ] Add lint check to CI (fail on errors)
- [ ] Remove unused code (commented-out functions, dead imports)
- [ ] Add pre-commit hook (lint-staged + husky) — optional

---

## Coverage Targets

| Layer | Target | Rationale |
|-------|--------|-----------|
| Backend unit | 80%+ | Core business logic (parsing, query building, services) |
| Backend integration | All API endpoints | Every route should have happy + error path tests |
| Frontend unit (Redux) | 90%+ | Reducers are pure functions — easy to test |
| Frontend components | 60%+ | Focus on user-facing behavior, not implementation |
| E2E | 3-5 critical flows | Expensive to maintain, cover the happy paths |

---

## Priority Order

1. **4a** (infrastructure) — Unblocks everything else
2. **4b + 4c** (backend tests) — Backend is stable, tests lock in behavior
3. **4d** (Redux tests) — Pure logic, fast to write, high confidence
4. **4g** (linting) — Can run in parallel with test writing
5. **4e** (component tests) — Requires more setup (mocking, rendering)
6. **4f** (E2E) — Last, requires Docker + full stack running

---

## Effort Estimate

| Sub-phase | Effort | Dependencies |
|-----------|--------|--------------|
| 4a | 1 day | None |
| 4b | 2 days | 4a |
| 4c | 2 days | 4a |
| 4d | 1-2 days | 4a |
| 4e | 3-4 days | 4a, 4d |
| 4f | 2-3 days | 4a, Docker setup |
| 4g | 1 day | None (can be done first) |

**Total: ~12-14 days**

---

## Notes

- Vitest is chosen over Mocha because it's ESM-native, integrates with Vite, and supports both frontend (jsdom) and backend (node) environments with one tool
- MSW is preferred over manual fetch mocking because it intercepts at the network level — tests are more realistic
- Playwright over Cypress because it's faster, supports multiple browsers, and has better CI integration
- The existing Mocha tests will be migrated to Vitest syntax (minimal changes — `describe`/`it` are the same)
- Backend integration tests that need PostgreSQL will be marked as requiring Docker (separate CI job)
