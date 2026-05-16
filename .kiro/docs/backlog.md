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

### 3b: React 19
- [ ] Update `react` and `react-dom` to ^19.x
- [ ] Replace `ReactDOM.render` with `createRoot` API
- [ ] Update `react-redux` to 9.x
- [ ] Update `@reduxjs/toolkit` to 2.x
- [ ] Remove `redux-thunk` (bundled in RTK 2.x)
- [ ] Remove `redux` direct dependency (bundled in RTK 2.x)
- [ ] Remove `prop-types` package
- [ ] Update `react-cytoscapejs` to 2.x
- [ ] Verify Cytoscape graph rendering works with React 19

### 3c: IBM Carbon Design System
- [ ] Install `@carbon/react` and `@carbon/ibm-products`
- [ ] Set up Carbon Sass tokens and global styles
- [ ] Build `NotificationProvider` + `useNotification` hook (toast replacement)
- [ ] Migrate components (14 files):
  - [ ] `ServerConnectFrame.jsx` — Form, Input, InputNumber, Button, Row, Col
  - [ ] `ServerDisconnectFrame.jsx` — Row, Col
  - [ ] `ServerStatusFrame.jsx` — Row, Col
  - [ ] `CypherResultTable.jsx` — Table
  - [ ] `CypherResultMeta.jsx` — Row, Col
  - [ ] `GraphFilterModal.jsx` — Modal, Input, Select, Button, message
  - [ ] `EdgeThicknessMenu.jsx` — Modal, Select, Input, Button
  - [ ] `Frame.jsx` — Button, Popover
  - [ ] `BuilderContainer.jsx` — Button, Drawer, Select, Space
  - [ ] `csv/index.jsx` — Button, Upload, message
  - [ ] `Alert.jsx` — Alert
  - [ ] `GraphInitializer.jsx` — Divider, Checkbox, Input
  - [ ] `SidebarComponents.jsx` — Select
  - [ ] `SidebarHome.jsx` — Modal
- [ ] Remove `antd`, `bootstrap`, `react-bootstrap` dependencies
- [ ] Remove `antd/dist/antd.css` and `bootstrap/dist/css/bootstrap.min.css` imports
- [ ] Replace Font Awesome with `@carbon/icons-react`
- [ ] Remove all `@fortawesome/*` packages

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
