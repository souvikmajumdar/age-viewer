# Modernization Backlog

**Last updated:** May 15, 2026

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

## Phase 2: Backend — Native ESM 🔲 PENDING

- [ ] Add `"type": "module"` to backend `package.json`
- [ ] Convert all `require()` → `import` statements across backend source
- [ ] Remove all `@babel/*` dev dependencies
- [ ] Remove `.babelrc`
- [ ] Update scripts: `babel-node` → `node`, remove `babel` build step
- [ ] Update Express to 5.x
  - [ ] Review middleware compatibility
  - [ ] Update error handling patterns (async error propagation)
- [ ] Update `antlr4` to 4.13.x
  - [ ] Regenerate parser from `Agtype.g4`
  - [ ] Update `CustomAgTypeListener.js` for API changes
- [ ] Update test stack
  - [ ] `mocha` → latest or migrate to `vitest`
  - [ ] `chai` → 5.x (ESM-only)
  - [ ] `supertest` → 7.x
- [ ] Update remaining backend deps to latest major
  - [ ] `uuid` 8.x → 11.x (CommonJS-compatible) or latest
  - [ ] `multer` 1.x → 2.x
  - [ ] `ejs` 3.x → 5.x
  - [ ] `csv` 5.x → 6.x
  - [ ] `http-status` 1.x → 2.x
  - [ ] `winston-daily-rotate-file` 4.x → 5.x
- [ ] Verify all tests pass
- [ ] Verify build/start works without Babel

---

## Phase 3: Frontend Modernization 🔲 PENDING

### 3a: CRA → Vite
- [ ] Remove `react-scripts` dependency
- [ ] Add `vite` + `@vitejs/plugin-react`
- [ ] Create `vite.config.js` with Sass and proxy config
- [ ] Move `public/index.html` → `index.html` (Vite convention)
- [ ] Update scripts: `vite` for dev, `vite build` for production
- [ ] Remove `NODE_OPTIONS=--openssl-legacy-provider` workaround
- [ ] Verify dev server and production build work

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
