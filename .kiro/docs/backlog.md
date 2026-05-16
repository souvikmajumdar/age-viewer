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

### 3d: Other Frontend Updates
- [ ] Update `axios` to 1.x
- [ ] Update CodeMirror to 6.x + `@uiw/react-codemirror` 4.x
- [ ] Remove `serve` dependency (not needed with Vite)
- [ ] Remove `webpack-dev-server` dev dependency

---

## Phase 4: Cleanup & Optimization 🔲 PENDING

- [ ] Update ESLint to 9.x with flat config
- [ ] Remove `babel-eslint` (use default parser)
- [ ] Audit and optimize bundle size
- [ ] Update Docker compose for test environment
- [ ] Remove unused packages (`react-cookies`, `ascii-table` if unused)
- [ ] Update README.md with final stack documentation
- [ ] Clean up any remaining deprecation warnings

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
