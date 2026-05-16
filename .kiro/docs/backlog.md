# Modernization Backlog

**Last updated:** May 16, 2026

---

## Phase 1: Foundation ✅ COMPLETE

> Released as [v0.5.0](https://github.com/souvikmajumdar/age-viewer/releases/tag/v0.5.0)

- [x] Update Node.js target to 24.x LTS
- [x] Update Dockerfile to `node:24-alpine`
- [x] Update CI workflow (Node 24, actions v4, development branch)
- [x] Update `engines` field in root package.json
- [x] Replace `npm-run-all` with `npm-run-all2`
- [x] Replace `pegjs` with `peggy`
- [x] Replace `@babel/plugin-proposal-class-properties` with transform version
- [x] Move `chai` from dependencies to devDependencies
- [x] Apply safe minor/patch updates (backend): express, pg, winston, ejs, debug, cors, etc.
- [x] Apply safe minor/patch updates (frontend): cytoscape, sass, antd, papaparse, etc.
- [x] Fix broken `cytoscape/src/util` import → `react-uuid`
- [x] Add `NODE_OPTIONS=--openssl-legacy-provider` workaround for CRA + Node 24

---

## Phase 2: Backend — Native ESM ✅ COMPLETE

> Released as [v0.6.0](https://github.com/souvikmajumdar/age-viewer/releases/tag/v0.6.0)

- [x] Add `"type": "module"` to backend `package.json`
- [x] Convert all `require()` → `import` statements across backend source
- [x] Remove all `@babel/*` dev dependencies
- [x] Remove `.babelrc`
- [x] Update scripts: `babel-node` → `node`, remove `babel` build step
- [x] Update remaining backend deps to latest major
  - [x] `multer` 1.x → 2.x (fixes 3 HIGH CVEs)
  - [x] `uuid` 8.x → 11.x
  - [x] `csv` 5.x → 6.x
  - [x] `http-status` 1.x → 2.x
  - [x] `winston-daily-rotate-file` 4.x → 5.x
- [x] Update test stack
  - [x] `mocha` 8.x → 11.x
  - [x] `chai` 4.x → 5.x (ESM-only)
  - [x] `supertest` 6.x → 7.x
  - [x] `nodemon` 2.x → 3.x
- [x] Verify all unit tests pass
- [x] Verify server starts without Babel
- [x] Update CI workflow (remove build step, run tests)

### Deferred from Phase 2
- Express 5.x — larger migration, current 4.21.2 is secure
- antlr4 4.13.x — parser works correctly, regeneration is risky
- ejs 5.x — breaking template changes, low priority

---

## Phase 3: Frontend Modernization 🔄 IN PROGRESS

### 3a: CRA → Vite ✅ COMPLETE

- [x] Remove `react-scripts` dependency
- [x] Add `vite` + `@vitejs/plugin-react`
- [x] Create `vite.config.js` with Sass and proxy config
- [x] Move `public/index.html` → `index.html` (Vite convention)
- [x] Update scripts: `vite` for dev, `vite build` for production
- [x] Remove `NODE_OPTIONS=--openssl-legacy-provider` workaround
- [x] Verify dev server and production build work
- [x] Fix local cytoscape-cxtmenu lib (module.exports → export default)
- [x] Remove babel-eslint, @babel/core, @testing-library/*, webpack-dev-server, serve

### 3b: React 19 ✅ COMPLETE
- [x] Update `react` and `react-dom` to ^19.1.0
- [x] Replace `ReactDOM.render` with `createRoot` API
- [x] Update `react-redux` to 9.x
- [x] Update `@reduxjs/toolkit` to 2.x
- [x] Remove `redux-thunk` (bundled in RTK 2.x)
- [x] Remove `redux` direct dependency (bundled in RTK 2.x)
- [x] Remove `prop-types` package
- [x] Update `react-cytoscapejs` to 2.x
- [x] Verify build works with React 19

### 3c: IBM Carbon Design System

#### Sub-phase 3c-i: Carbon Setup + Notification System ✅ COMPLETE
- [x] Install `@carbon/react`, `@carbon/icons-react`
- [x] Set up Carbon Sass tokens and global styles (replace antd/bootstrap CSS imports in `App.jsx`)
- [x] Build `NotificationProvider` context + `useNotification` hook
- [x] Wrap app in `<NotificationProvider>` in `App.jsx`
- [x] Verify build works with Carbon installed alongside antd (coexistence during migration)

#### Sub-phase 3c-ii: Migrate Layout & Simple Components (7 files) ✅ COMPLETE
- [x] `ServerDisconnectFrame.jsx` — antd Row/Col → Carbon Grid/Column
- [x] `ServerStatusFrame.jsx` — antd Row/Col + react-bootstrap Button → Carbon
- [x] `CypherResultMeta.jsx` — antd Row/Col → Carbon Grid/Column
- [x] `Alert.jsx` — antd Alert → Carbon InlineNotification
- [x] `SidebarComponents.jsx` — antd Select + react-bootstrap Col → Carbon Dropdown
- [x] `Frame.jsx` — antd Button/Popover → Carbon Button/Popover
- [x] `DefaultTemplate.jsx` — react-bootstrap Row/Button → Carbon

#### Sub-phase 3c-iii: Migrate Forms & Modals (5 files) ✅ COMPLETE
- [x] `ServerConnectFrame.jsx` — antd Form/Input/InputNumber/Button/Row/Col → Carbon Form/TextInput/NumberInput/Button/Grid
- [x] `GraphFilterModal.jsx` — antd Modal/Input/Select/Button + message → Carbon Modal/TextInput/Dropdown/Button + useNotification
- [x] `EdgeThicknessMenu.jsx` — removed dead antd import (already uses native HTML)
- [x] `SidebarHome.jsx` — antd Modal.confirm → window.confirm, removed all PropTypes
- [x] `GraphInitializer.jsx` — antd Divider/Checkbox/Input + react-bootstrap Modal/Row/Col/Button/ListGroup/Spinner/Alert → Carbon

#### Sub-phase 3c-iv: Migrate Data Display & Remaining (6 files) ✅ COMPLETE
- [x] `CypherResultTable.jsx` — antd Table → HTML table with Carbon styling
- [x] `BuilderContainer.jsx` — antd Drawer/Select/Button → Carbon Dropdown/Button + panel div
- [x] `csv/index.jsx` — antd Button/Upload + message → Carbon FileUploader + useNotification
- [x] `BuilderSelection.jsx` — react-bootstrap ListGroup/Button → Carbon Button + ul/li
- [x] `CypherResultCytoscapeLegend.jsx` — react-bootstrap Badge → styled span
- [x] `CypherResultCytoscapeFooter.jsx` — react-bootstrap Badge → styled span

#### Sub-phase 3c-v: Migrate Modals & Tutorial (5 files) ✅ COMPLETE
- [x] `ModalDialog.jsx` — react-bootstrap Button/Modal → Carbon Modal (danger)
- [x] `TutorialDialog.jsx` — react-bootstrap Modal → Carbon Modal (passiveModal)
- [x] `TutorialHeader.jsx` — react-bootstrap Modal.Header → plain styled div
- [x] `TutorialBody.jsx` — react-bootstrap Modal.Body/Image → div + img
- [x] `TutorialFooter.jsx` — react-bootstrap Modal.Footer/Button → Carbon Button + div

#### Sub-phase 3c-vi: Fix Carbon IBM Plex Font Resolution ✅ COMPLETE
> **Discovered during 3c-iii CI build.** Carbon's Sass uses Webpack's `~package-name` syntax to reference IBM Plex fonts. Vite/Rollup doesn't resolve `~` aliases by default, so font references end up as `~@ibm/plex/...` in the built CSS — which the browser cannot resolve, resulting in fallback fonts in production.
- [x] Add Vite alias resolution for `~@ibm/plex` → `node_modules/@ibm/plex` in `vite.config.js`
- [x] Verify fonts are bundled and loaded correctly in production build
- [x] Confirm no `didn't resolve at build time` warnings remain in CI
- [x] Document the workaround in `vite.config.js` with a comment explaining why

#### Sub-phase 3c-vii: Icon Migration + Final Cleanup (16 files) ✅ COMPLETE
- [x] Replace all `@fortawesome/react-fontawesome` + icon imports with `@carbon/icons-react`
- [x] Files: Frame.jsx, ServerStatusFrame.jsx, ServerDisconnectFrame.jsx, Alert.jsx, CypherResultCytoscapeChart.jsx, CypherResultCytoscapeFooter.jsx, CypherResultCytoscapeLegend.jsx, CypherResultTab.jsx, GraphFilterModal.jsx, GraphInitializer.jsx, SidebarHome.jsx, DefaultTemplate.jsx, Editor.jsx, SidebarMeunuToggle.jsx, NavigatorItem.jsx, MenuSlice.js
- [x] Remove all `@fortawesome/*` packages from package.json
- [x] Remove `antd`, `bootstrap`, `react-bootstrap` from package.json
- [x] Remove `antd/dist/antd.css` and `bootstrap/dist/css/bootstrap.min.css` from App.jsx
- [x] Final build verification — no antd/bootstrap/fontawesome references remaining

### 3d: Other Frontend Updates ✅ COMPLETE
- [x] Remove `axios` (dead dependency — never imported)
- [x] Replace `react-uuid` with native `crypto.randomUUID()` (13 files)
- [x] Replace `json2csv` with `papaparse` (already installed)
- [x] Update CodeMirror 5 → 6 + `@uiw/react-codemirror` 3 → 4 (complete rewrite)
- [x] Replace `react-cookies` with native `document.cookie` helpers
- [x] Remove `serve` dependency (already removed in 3a)
- [x] Remove `webpack-dev-server` dev dependency (already removed in 3a)

---

## Phase 4: Testing & Quality 🔲 PENDING

> See [testing-and-quality-plan.md](testing-and-quality-plan.md) for full details.

### 4a: Test Infrastructure Setup ✅ COMPLETE
- [x] Install Vitest + jsdom + React Testing Library + MSW for frontend
- [x] Add Vitest to backend (replace Mocha)
- [x] Migrate existing backend tests from Mocha → Vitest syntax
- [x] Add coverage reporting configuration
- [x] Add test commands to CI workflow
- [x] **Defect fix:** RTK 2.x `extraReducers` object notation → builder callback (3 slices: DatabaseSlice, MetadataSlice, CypherSlice)
- [x] **Defect fix:** `combineReducers` import from `redux` → `@reduxjs/toolkit`
- [x] Smoke test verifies Redux store initializes correctly

### 4b: Backend Unit Tests ✅ COMPLETE
- [x] cypherService — createResult, convertVertex, convertEdge, convertPath
- [x] databaseService — parseMeta, graphNameInitialize, isConnected, connectDatabase, disconnectDatabase, getConnectionStatus, getConnectionInfo
- [x] sessionService — put, get
- [x] QueryBuilder — query generation, custom start/end, multiple inserts
- [x] GraphCreator — parseData, createNode, createEdge, createGraph
- [x] SQLFlavorManager — getQuery with different versions
- [x] ObjectExtras — getDelete, toAgeProps

**Result:** 71 tests passing (up from 6). Backend coverage: ~38% statements (services well-covered, routes/controllers deferred to 4c)

### 4c: Backend Integration Tests (API) ✅ COMPLETE
- [x] GET /api/v1/db — not connected returns 500
- [x] POST /api/v1/db/connect — invalid credentials returns 500
- [x] GET /api/v1/db/disconnect — not connected returns 500
- [x] POST /api/v1/db/meta — not connected returns 500
- [x] POST /api/v1/cypher — not connected returns 500, empty body returns 500
- [x] GET /api/v1/miscellaneous — returns 200 with keyword list
- [x] Error handler middleware — JSON format with severity/message/code
- [x] Session creation and isolation between agents
- [x] CORS headers present

**Result:** 86 tests passing (15 new API tests). Connected-state tests deferred to E2E (require PostgreSQL).

### 4d: Frontend Unit Tests (Redux + Utilities) ✅ COMPLETE
- [x] FrameSlice — addFrame, removeFrame, trimFrame (11 tests)
- [x] AlertSlice — addAlert, removeAlert, alertType classification (10 tests)
- [x] DatabaseSlice — changeGraph, extraReducers state transitions (7 tests)
- [x] CookieUtil — loadFromCookie, saveToCookie, loadAllFromCookie (8 tests)
- [x] useNotification hook — all methods, auto-dismiss, DOM rendering (10 tests)

**Result:** 51 frontend tests passing. Redux slices and utilities fully covered.

### 4e: Frontend Component Tests ✅ COMPLETE
- [x] Alert — renders correct notification type, auto-clears (7 tests)
- [x] Frame — renders reqString, buttons, conditional controls (9 tests)
- [x] ServerConnectFrame — form rendering, placeholders, frame integration (6 tests)
- [x] BuilderContainer — open/close, panel content, code editor (6 tests)
- [x] Test utilities: renderWithProviders helper for Redux + Notification context

**Result:** 79 frontend tests passing. Note: Carbon Modal (portal-based) components deferred to E2E testing.

### 4f: E2E Tests (Playwright)
### 4f: E2E Tests (Playwright)

#### 4f-i: E2E Infrastructure Setup
- [ ] Create `scripts/e2e-run.sh` — orchestrator (calls check → setup if needed → test)
- [ ] Create `scripts/e2e-check-env.sh` — validates Docker/Podman, container running, DB accessible
- [ ] Create `scripts/e2e-setup-env.sh` — pulls `apache/age` image, starts container, configures RBAC
- [ ] Create `scripts/e2e-test.sh` — starts backend + frontend, runs Playwright
- [ ] Update `docker-compose.yml` for test environment (replace old Postgres 11 setup)
- [ ] Install Playwright as dev dependency
- [ ] Create `playwright.config.js`
- [ ] Add `e2e` script to root package.json
- [ ] Add E2E CI workflow (separate file, PRs to `development` only)
- [ ] Document the setup

#### 4f-ii: E2E Test Scenarios
- [ ] Flow 1: Connect to database → verify status frame
- [ ] Flow 2: Execute Cypher query → verify graph visualization
- [ ] Flow 3: Create graph from CSV → verify success notification
- [ ] Flow 4: Filter graph results → verify table/graph updates
- [ ] Flow 5: Disconnect → verify disconnect frame

### 4g: Code Quality & Linting
- [ ] Update ESLint to 9.x with flat config (frontend)
- [ ] Add ESLint to backend
- [ ] Add Prettier config
- [ ] Add lint/format scripts
- [ ] Add lint check to CI
- [ ] Add pre-commit hook (lint-staged + husky)

---

## Phase 5: TypeScript Migration 🔲 FUTURE

- [ ] Add `tsconfig.json` with strict mode
- [ ] Convert new files to TypeScript
- [ ] Incrementally convert existing files (start with utilities, models)
- [ ] Leverage Carbon's TypeScript definitions
- [ ] Add type checking to CI pipeline

---

## Notes

- Each phase gets its own feature branch and PR → `development`
- Releases are tagged after each phase merges
- Database-dependent tests require a running PostgreSQL + AGE instance
