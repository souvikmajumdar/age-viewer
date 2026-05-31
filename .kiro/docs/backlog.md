# Modernization Backlog

**Last updated:** May 30, 2026

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

## Phase 3: Frontend Modernization ✅ COMPLETE

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

#### 4f-i: E2E Infrastructure Setup ✅ COMPLETE
- [x] Create `scripts/e2e-run.sh` — orchestrator (calls check → setup if needed → test)
- [x] Create `scripts/e2e-check-env.sh` — validates Docker/Podman, container running, DB accessible
- [x] Create `scripts/e2e-setup-env.sh` — pulls `apache/age` image, starts container, configures RBAC
- [x] Create `scripts/e2e-test.sh` — starts backend + frontend, runs Playwright
- [x] Update `docker-compose.yml` for test environment (replace old Postgres 11 setup)
- [x] Install Playwright as dev dependency
- [x] Create `playwright.config.js`
- [x] Add `e2e` script to root package.json
- [x] Add E2E CI workflow (separate file, PRs to `development` only)
- [x] Smoke test placeholder

#### 4f-prerequisite: PostgreSQL Version Support (PG 16-18) ✅ COMPLETE
> Discovered during E2E testing: app only has SQL for PG 11-15, but `apache/age:latest` ships PG 18.
> See [pg-version-support-plan.md](pg-version-support-plan.md) for full analysis.
- [x] Add `sql/16/`, `sql/17/`, `sql/18/` directories (copy from `sql/15/`)
- [x] Verify SQL works against PG 18 with AGE extension
- [x] Remove `sql/11/`, `sql/12/`, `sql/13/` (EOL versions)
- [x] Update `SQLFlavorManager.js` — version validation, clear error for unsupported versions
- [x] Fix `useEffect(async () => ...)` crash in DefaultTemplate (React 19 incompatibility)
- [x] Fix Alert component — remove interactive elements from InlineNotification subtitles (Carbon crash)
- [x] Verify E2E runs successfully with `apache/age:latest` (PG 18)

#### 4f-ii: E2E Test Scenarios ✅ COMPLETE (initial set)
- [x] Flow 1: App loads and shows connection form (smoke)
- [x] Flow 2: Connect to database → verify status frame
- [x] Flow 3: Shows error on invalid connection
- [ ] Flow 4: Execute Cypher query → verify result (deferred — requires CodeMirror editor interaction)
- [ ] Flow 5: Disconnect → verify disconnect frame (deferred — requires CodeMirror editor interaction)
- [ ] Flow 6: Create graph from CSV (deferred — complex multi-step flow)

### 4g: Code Quality & Linting ✅ COMPLETE
- [x] Update ESLint to 9.x with flat config (root-level, covers both frontend and backend)
- [x] Add ESLint to backend (via root config)
- [x] Add Prettier config (`.prettierrc`)
- [x] Add lint/format scripts (`lint`, `lint:fix`, `format`, `format:check`)
- [x] Add lint check to CI (non-blocking warning for now)
- [x] Remove old frontend `.eslintrc.js` and ESLint 7 packages

---

## Phase 5: CSS/Layout Fix — Carbon Grid Implementation ✅ COMPLETE

> Layout was broken after Bootstrap removal. Text wrapped character-by-character, no horizontal layouts, sidebar/content structure collapsed.
> Fixed with a full panel-based UI redesign and dead code cleanup.
> Merged via PRs #32 (layout fix) and #33 (dead code cleanup).

### 5a: Audit & Plan ✅
### 5b: Page Layout & Structure ✅
- [x] Redesign main page layout with panel-based UI
- [x] Fix sidebar, editor, and content area layout
- [x] Fix connection form layout

### 5c: Component-Level Fixes ✅
- [x] Fix Frame component layout
- [x] Fix graph visualization footer/legend areas
- [x] Fix modal layouts

### 5d: Cleanup & Verification ✅
- [x] Remove all dead Bootstrap class references and pre-redesign dead code
- [x] Verify all pages render correctly

---

## Phase 6: TypeScript Migration 🔄 IN PROGRESS

> See [typescript-migration-plan.md](typescript-migration-plan.md) for full details.
> Scope: 137 source files, ~13,600 LOC. Strategy: incremental, loose → strict.

### 6a: TypeScript Infrastructure Setup ✅ COMPLETE
> Merged via PR #34
- [x] Install TypeScript 5.x, tsx, @types/* packages
- [x] Create tsconfig.base.json, backend/tsconfig.json, frontend/tsconfig.json
- [x] Configure Vite, Vitest, ESLint for TypeScript
- [x] Add `tsc --noEmit` type-check to CI
- [x] Verify existing JS works with allowJs: true

### 6b: Shared Type Definitions ✅ COMPLETE
> Merged via PR #35
- [x] Create backend/src/types/ (database, api, age types)
- [x] Create frontend/src/types/ (api, redux, graph types)
- [x] Create typed Redux hooks (useAppDispatch, useAppSelector)

### 6c: Backend Migration (22 files → .ts) ✅ COMPLETE
> Merged via PR #36
- [x] Wave 1: Pure utilities (ObjectExtras, JsonBuilder, Routes, Pg, Flavors, winston)
- [x] Wave 2: Models (QueryBuilder, GraphRepository, GraphCreator)
- [x] Wave 3: Services (sessionService, cypherService, databaseService, queryList)
- [x] Wave 4: Controllers & Routes (all 6 files)
- [x] Wave 5: Entry point & tools (app.ts, www.ts, SQLFlavorManager.ts, AGEParser.ts)
- [x] Skip: ANTLR generated files (AgtypeLexer, AgtypeParser, AgtypeListener)

### 6d: Frontend Utilities & Redux (15 files → .ts) ✅ COMPLETE
> Merged via PR #37
- [x] Redux store setup (store.ts, reducers.ts, hooks.ts)
- [x] All 10 Redux slices → .ts (AlertSlice, CypherSlice, DatabaseSlice, EditorSlice, FrameSlice, LayoutSlice, MenuSlice, MetadataSlice, ModalSlice, SettingSlice)
- [x] Utilities & hooks → .ts (CookieUtil, CypherUtil, KeyWordFinder, Capture)
- [x] useNotification hook → .tsx

### 6e: Frontend Components (~70 files) 🔄 IN PROGRESS
> Branch: `feature/phase-6e-frontend-components-ts`

**Converted so far (~14 files):**
- [x] `App.tsx`, `index.tsx`, `pages/Main/MainPage.tsx`
- [x] Icons: EdgeWeight, IconFilter, IconGraph, IconPlay, IconSearchCancel (5 files)
- [x] `hooks/useNotification.tsx`
- [x] `components/cytoscape/CytoscapeConfig.ts`, `CytoscapeLayouts.ts`, `CytoscapeStyleSheet.ts`
- [x] `components/template/DefaultTemplate.ts`
- [x] `conf/config.ts`

**Remaining (~50 files):**
- [ ] **Wave 1 — Simple/leaf components**
  - [ ] `components/alert/presentations/Alert.jsx`
  - [ ] `components/cytoscape/CypherResultTab.jsx` (refactor class → function)
  - [ ] `components/cytoscape/CypherResultCytoscapeFooter.jsx`
  - [ ] `components/cytoscape/CypherResultCytoscapeLegend.jsx` (refactor class → function)
  - [ ] `components/cypherresult/presentations/CypherResultMeta.jsx`
  - [ ] `components/cypherresult/presentations/CypherResultText.jsx`
  - [ ] `components/inspector/InspectorPanel.jsx`

- [ ] **Wave 2 — Form/modal components**
  - [ ] `components/frame/presentations/ServerConnectFrame.jsx`
  - [ ] `components/frame/presentations/ServerDisconnectFrame.jsx`
  - [ ] `components/frame/presentations/ServerStatusFrame.jsx`
  - [ ] `components/cypherresult/components/GraphFilterModal.jsx`
  - [ ] `components/cypherresult/components/EdgeThicknessMenu.jsx`
  - [ ] `components/initializer/presentation/GraphInitializer.jsx`
  - [ ] `components/query_builder/BuilderContainer.jsx`
  - [ ] `components/query_builder/BuilderSelection.jsx`
  - [ ] `components/csv/index.jsx`
  - [ ] `components/modal/presentations/` (5 files: ModalDialog, TutorialDialog, TutorialHeader, TutorialBody, TutorialFooter)

- [ ] **Wave 3 — Complex components**
  - [ ] `components/frame/Frame.jsx`
  - [ ] `components/frame/presentations/` (ContentsFrame, CypherGraphResultFrame, CypherResultFrame)
  - [ ] `components/cypherresult/presentations/CypherResultTable.jsx`
  - [ ] `components/cypherresult/presentations/CypherResultCytoscape.jsx`
  - [ ] `components/cytoscape/CypherResultCytoscapeChart.jsx`
  - [ ] `components/cytoscape/MetadataCytoscapeChart.jsx`
  - [ ] `components/contents/presentations/` (Contents, Editor, Frames)
  - [ ] `components/editor/presentations/CodeMirrorWrapper.jsx`
  - [ ] `components/sidebar/presentations/SidebarSetting.jsx`
  - [ ] `components/template/presentations/DefaultTemplate.jsx`

- [ ] **Wave 4 — Container components (refactor connect() → hooks)**
  - [ ] `components/alert/containers/AlertContainers.js`
  - [ ] `components/contents/containers/` (Contents, Editor, Frames)
  - [ ] `components/cypherresult/containers/` (4 files)
  - [ ] `components/editor/containers/CodeMirrorWapperContainer.js`
  - [ ] `components/frame/containers/` (6 files)
  - [ ] `components/modal/containers/` (Modal, Tutorial)
  - [ ] `components/sidebar/containers/SidebarSetting.js`

- [ ] **Tests** (update to TypeScript after components done)
  - [ ] `test/` (11 test files: Alert, AlertSlice, BuilderContainer, CookieUtil, DatabaseSlice, Frame, FrameSlice, ServerConnectFrame, smoke, test-utils, useNotification)

- [ ] **Skip:** `lib/cytoscape-cxtmenu/` (vendored third-party, add .d.ts declaration instead)

### 6f: Strict Mode & Cleanup 🔲 PENDING
- [ ] Enable `strict: true` in both tsconfigs
- [ ] Enable `noImplicitAny: true`, `strictNullChecks: true`
- [ ] Fix all resulting type errors
- [ ] Remove `// @ts-ignore` and `any` types where possible
- [ ] Add return types to all exported functions
- [ ] Update CI to fail on type errors (`tsc --noEmit`)
- [ ] Remove `allowJs: true` (all files converted)
- [ ] Update tests to TypeScript

---

## Future / Backlog Items

### Evaluate Docker Base Image
> RHDA reports 3 vulnerabilities (1 High, 2 Medium) in `node:24-alpine` base image.
> These are upstream Alpine/Node.js CVEs, not application code issues.
- [ ] Evaluate base image options (Alpine vs UBI 9 vs Distroless)
- [ ] **Note:** UBI 9 (`registry.access.redhat.com/ubi9/nodejs-24`) is the recommended choice for enterprise deployments — works on all Kubernetes platforms (AKS, GKE, EKS, IKS, OpenShift), gets Red Hat's security patching cadence, and integrates with RHDA/Trustify scanning
- [ ] Update Dockerfile with chosen base image
- [ ] Verify build and runtime behavior
- [ ] Update CI workflow if image registry changes

---

## Notes

- Each phase gets its own feature branch and PR → `development`
- Releases are tagged after each phase merges
- Database-dependent tests require a running PostgreSQL + AGE instance
