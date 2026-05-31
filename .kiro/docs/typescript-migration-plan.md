# Phase 5: TypeScript Migration Plan

**Date:** May 18, 2026 (updated May 30, 2026)
**Scope:** 137 source files (27 backend + 110 frontend), ~13,600 lines of code
**Strategy:** Incremental migration — file by file, strictness ratcheted up progressively
**Status:** 6a-6d complete. 6e (frontend components) in progress. ~14 files done, ~50 remaining.

---

## Codebase Assessment

### Backend (27 files)

| Layer | Files | Complexity | Migration Difficulty |
|-------|-------|-----------|---------------------|
| tools/ (ANTLR parsers) | 6 | High (generated code) | **Skip** — generated, not worth typing |
| services/ | 4 | Medium (227 LOC max) | Medium — async patterns, DB types |
| models/ | 3 | Medium (177 LOC max) | Medium — class-based, pg types |
| controllers/ | 2 | Low (93 LOC max) | Easy — Express req/res typing |
| routes/ | 4 | Low | Easy — Express Router |
| config/ | 3 | Low | Easy — simple objects |
| util/ | 2 | Low | Easy — pure functions |
| common/ | 1 | Low | Easy — single function |
| bin/ | 1 | Low | Easy — entry point |
| app.js | 1 | Medium | Medium — middleware chain |

### Frontend (110 files)

| Category | Files | Complexity | Migration Difficulty |
|----------|-------|-----------|---------------------|
| Redux slices (features/) | 10 | Medium | Medium — async thunks, state shapes |
| Container components (connect()) | 22 | Low | Easy — but legacy pattern |
| Presentation components | ~40 | Varies | Medium — props typing |
| Cytoscape/graph components | 8 | High (444 LOC max) | Hard — complex state, callbacks |
| Test files | 12 | Low | Easy — Vitest types |
| Utilities/hooks | 5 | Low | Easy |
| lib/ (cytoscape-cxtmenu) | 5 | Medium | **Skip** — third-party vendored code |
| Icons | 5 | Low | Easy — SVG components |

### Legacy Patterns That Complicate Migration

| Pattern | Count | Impact |
|---------|-------|--------|
| `connect()` HOC (old Redux) | 22 files | Need `mapStateToProps`/`mapDispatchToProps` typing or refactor to hooks |
| Class components | 3 files | Need class-based typing or refactor to functions |
| Untyped props (no PropTypes) | All files | Need interface definitions from scratch |
| Dynamic object shapes (cytoscape data) | ~8 files | Complex generic types needed |

---

## Type Definition Availability

| Package | Types Source | Notes |
|---------|-------------|-------|
| express | `@types/express` | Well-maintained |
| pg | `@types/pg` | Well-maintained |
| react / react-dom | `@types/react` | Well-maintained |
| @reduxjs/toolkit | Built-in | Excellent TS support |
| react-redux | Built-in | Excellent TS support |
| @carbon/react | Built-in (partial) | `skipLibCheck: true` recommended |
| cytoscape | `@types/cytoscape` | Available |
| papaparse | `@types/papaparse` | Available |
| multer | `@types/multer` | Available |
| cors | `@types/cors` | Available |
| cookie-parser | `@types/cookie-parser` | Available |
| express-session | `@types/express-session` | Available |
| uuid | `@types/uuid` | Available |
| morgan | `@types/morgan` | Available |
| debug | `@types/debug` | Available |
| antlr4 | None | Skip (generated code) |
| react-cytoscapejs | None | Need custom declarations |
| file-saver | `@types/file-saver` | Available |

---

## Migration Strategy

### Approach: "Loose to Strict" Incremental

```
Phase 5a: Infrastructure (tsconfig, tooling, allowJs)
    ↓
Phase 5b: Shared types (interfaces, API contracts)
    ↓
Phase 5c: Backend migration (bottom-up: utils → models → services → controllers → routes)
    ↓
Phase 5d: Frontend utilities & Redux (slices, hooks, store)
    ↓
Phase 5e: Frontend components (leaf → container, simple → complex)
    ↓
Phase 5f: Strict mode + cleanup
```

---

## Sub-phases

### 5a: TypeScript Infrastructure Setup ✅ COMPLETE (Phase 6a, PR #34)
- [x] Install TypeScript 5.x, `tsx` (for running .ts directly in Node)
- [x] Create `backend/tsconfig.json` (ESM, Node 24, strict: false initially)
- [x] Create `frontend/tsconfig.json` (JSX, Vite integration)
- [x] Create `tsconfig.base.json` at root (shared compiler options)
- [x] Install `@types/*` packages for all dependencies
- [x] Configure Vite to handle `.ts`/`.tsx` files (already supported via plugin-react)
- [x] Configure Vitest to handle TypeScript test files
- [x] Update ESLint config for TypeScript (`@typescript-eslint/parser`)
- [x] Add `tsc --noEmit` type-check command to CI
- [x] Verify existing JS files still work with `allowJs: true`

### 5b: Shared Type Definitions ✅ COMPLETE (Phase 6b, PR #35)
- [x] Create `backend/src/types/` directory
  - [x] `database.ts` — connection info, graph metadata, query results
  - [x] `api.ts` — request/response shapes for all endpoints
  - [x] `age.ts` — AGE-specific types (vertex, edge, path, agtype)
- [x] Create `frontend/src/types/` directory
  - [x] `api.ts` — API response types (shared with backend)
  - [x] `redux.ts` — RootState, AppDispatch, typed hooks
  - [x] `graph.ts` — cytoscape element types, legend data, layout options
- [x] Create typed Redux hooks (`useAppDispatch`, `useAppSelector`)

### 5c: Backend Migration (27 files → .ts) ✅ COMPLETE (Phase 6c, PR #36)
**Order: bottom-up (dependencies first)**

- [x] **Wave 1 — Pure utilities (no deps)**
  - [x] `src/util/ObjectExtras.js` → `.ts`
  - [x] `src/util/JsonBuilder.js` → `.ts`
  - [x] `src/common/Routes.js` → `.ts`
  - [x] `src/config/Pg.js` → `.ts`
  - [x] `src/config/Flavors.js` → `.ts`
  - [x] `src/config/winston.js` → `.ts`

- [x] **Wave 2 — Models**
  - [x] `src/models/QueryBuilder.js` → `.ts`
  - [x] `src/models/GraphRepository.js` → `.ts`
  - [x] `src/models/GraphCreator.js` → `.ts`

- [x] **Wave 3 — Services**
  - [x] `src/services/sessionService.js` → `.ts`
  - [x] `src/services/cypherService.js` → `.ts`
  - [x] `src/services/databaseService.js` → `.ts`
  - [x] `src/services/queryList.js` → `.ts`

- [x] **Wave 4 — Controllers & Routes**
  - [x] `src/controllers/cypherController.js` → `.ts`
  - [x] `src/controllers/databaseController.js` → `.ts`
  - [x] `src/routes/cypherRouter.js` → `.ts`
  - [x] `src/routes/databaseRouter.js` → `.ts`
  - [x] `src/routes/miscellaneous.js` → `.ts`
  - [x] `src/routes/sessionRouter.js` → `.ts`

- [x] **Wave 5 — Entry point & tools**
  - [x] `src/app.js` → `.ts`
  - [x] `src/bin/www.js` → `.ts`
  - [x] `src/tools/SQLFlavorManager.js` → `.ts`
  - [x] `src/tools/AGEParser.js` → `.ts`
  - [x] `src/tools/CustomAgTypeListener.js` → `.ts`

- [x] **Skip:** `AgtypeLexer.js`, `AgtypeParser.js`, `AgtypeListener.js` (ANTLR generated)

### 5d: Frontend Utilities & Redux ✅ COMPLETE (Phase 6d, PR #37)
- [x] **Redux store setup**
  - [x] `src/app/store.js` → `.ts` (typed store)
  - [x] `src/app/reducers.js` → `.ts`
  - [x] Create `src/app/hooks.ts` (useAppDispatch, useAppSelector)

- [x] **Redux slices** (10 files)
  - [x] `features/alert/AlertSlice.js` → `.ts`
  - [x] `features/editor/EditorSlice.js` → `.ts`
  - [x] `features/frame/FrameSlice.js` → `.ts`
  - [x] `features/layout/LayoutSlice.js` → `.ts`
  - [x] `features/menu/MenuSlice.js` → `.ts`
  - [x] `features/modal/ModalSlice.js` → `.ts`
  - [x] `features/setting/SettingSlice.js` → `.ts`
  - [x] `features/database/DatabaseSlice.js` → `.ts`
  - [x] `features/database/MetadataSlice.js` → `.ts`
  - [x] `features/cypher/CypherSlice.js` → `.ts`

- [x] **Utilities & hooks**
  - [x] `features/cookie/CookieUtil.js` → `.ts`
  - [x] `features/cypher/CypherUtil.js` → `.ts`
  - [x] `features/query_builder/KeyWordFinder.js` → `.ts`
  - [x] `hooks/useNotification.jsx` → `.tsx`

### 5e: Frontend Components 🔄 IN PROGRESS (Phase 6e)
> Branch: `feature/phase-6e-frontend-components-ts`
**Order: leaf components first, then containers**

- [x] **Converted so far (~14 files)**
  - [x] `App.tsx`, `index.tsx`, `pages/Main/MainPage.tsx`
  - [x] Icons (5 files): EdgeWeight, IconFilter, IconGraph, IconPlay, IconSearchCancel → `.tsx`
  - [x] `hooks/useNotification.jsx` → `.tsx`
  - [x] `components/cytoscape/CytoscapeConfig.ts`, `CytoscapeLayouts.ts`, `CytoscapeStyleSheet.ts`
  - [x] `components/template/DefaultTemplate.ts`
  - [x] `conf/config.ts`

- [ ] **Wave 1 — Simple/leaf components**
  - [ ] `components/alert/presentations/Alert.jsx` → `.tsx`
  - [ ] `components/cytoscape/CypherResultTab.jsx` → `.tsx` (refactor class → function)
  - [ ] `components/cytoscape/CypherResultCytoscapeFooter.jsx` → `.tsx`
  - [ ] `components/cytoscape/CypherResultCytoscapeLegend.jsx` → `.tsx` (refactor class → function)
  - [ ] `components/cypherresult/presentations/CypherResultMeta.jsx` → `.tsx`
  - [ ] `components/cypherresult/presentations/CypherResultText.jsx` → `.tsx`
  - [ ] `components/inspector/InspectorPanel.jsx` → `.tsx`

- [ ] **Wave 2 — Form/modal components**
  - [ ] `components/frame/presentations/ServerConnectFrame.jsx` → `.tsx`
  - [ ] `components/frame/presentations/ServerDisconnectFrame.jsx` → `.tsx`
  - [ ] `components/frame/presentations/ServerStatusFrame.jsx` → `.tsx`
  - [ ] `components/cypherresult/components/GraphFilterModal.jsx` → `.tsx`
  - [ ] `components/cypherresult/components/EdgeThicknessMenu.jsx` → `.tsx`
  - [ ] `components/initializer/presentation/GraphInitializer.jsx` → `.tsx`
  - [ ] `components/query_builder/BuilderContainer.jsx` → `.tsx`
  - [ ] `components/query_builder/BuilderSelection.jsx` → `.tsx`
  - [ ] `components/csv/index.jsx` → `.tsx`
  - [ ] Modal components (5 files) → `.tsx`

- [ ] **Wave 3 — Complex components**
  - [ ] `components/frame/Frame.jsx` → `.tsx`
  - [ ] `components/frame/presentations/` (ContentsFrame, CypherGraphResultFrame, CypherResultFrame) → `.tsx`
  - [ ] `components/cypherresult/presentations/CypherResultTable.jsx` → `.tsx`
  - [ ] `components/cypherresult/presentations/CypherResultCytoscape.jsx` → `.tsx`
  - [ ] `components/cytoscape/CypherResultCytoscapeChart.jsx` → `.tsx`
  - [ ] `components/cytoscape/MetadataCytoscapeChart.jsx` → `.tsx`
  - [ ] `components/contents/presentations/` (Contents, Editor, Frames) → `.tsx`
  - [ ] `components/editor/presentations/CodeMirrorWrapper.jsx` → `.tsx`
  - [ ] `components/sidebar/presentations/SidebarSetting.jsx` → `.tsx`
  - [ ] `components/template/presentations/DefaultTemplate.jsx` → `.tsx`

- [ ] **Wave 4 — Container components (refactor connect() → hooks)**
  - [ ] `components/alert/containers/AlertContainers.js` → `.ts`
  - [ ] `components/contents/containers/` (Contents, Editor, Frames) → `.ts`
  - [ ] `components/cypherresult/containers/` (4 files) → `.ts`
  - [ ] `components/editor/containers/CodeMirrorWapperContainer.js` → `.ts`
  - [ ] `components/frame/containers/` (6 files) → `.ts`
  - [ ] `components/modal/containers/` (Modal, Tutorial) → `.ts`
  - [ ] `components/sidebar/containers/SidebarSetting.js` → `.ts`

- [ ] **Tests** (update after components done)
  - [ ] `test/` (11 test files) → `.ts`/`.tsx`

- [x] **Skip:** `lib/cytoscape-cxtmenu/` (vendored third-party, add .d.ts declaration instead)

### 5f: Strict Mode & Cleanup 🔲 PENDING (Phase 6f — after 6e complete)
- [ ] Enable `strict: true` in both tsconfigs
- [ ] Enable `noImplicitAny: true`
- [ ] Enable `strictNullChecks: true`
- [ ] Fix all resulting type errors
- [ ] Remove `// @ts-ignore` and `any` types where possible
- [ ] Add return types to all exported functions
- [ ] Update CI to fail on type errors (`tsc --noEmit`)
- [ ] Remove `allowJs: true` (all files converted)
- [ ] Update tests to TypeScript

---

## tsconfig Strategy

```json
// tsconfig.base.json (root)
{
  "compilerOptions": {
    "target": "ES2024",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}

// backend/tsconfig.json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": false,  // Start loose, tighten in 5f
    "allowJs": true,
    "checkJs": false
  },
  "include": ["src/**/*"],
  "exclude": ["src/tools/Agtype*.js"]
}

// frontend/tsconfig.json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2024", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": false,  // Start loose, tighten in 5f
    "allowJs": true,
    "checkJs": false,
    "noEmit": true
  },
  "include": ["src/**/*"],
  "exclude": ["src/lib/**"]
}
```

---

## Effort Estimate

| Sub-phase | Files | Effort | Dependencies |
|-----------|-------|--------|--------------|
| 5a | Config only | 1 day | None |
| 5b | ~8 new type files | 1-2 days | 5a |
| 5c | 22 files | 3-4 days | 5a, 5b |
| 5d | ~15 files | 2-3 days | 5a, 5b |
| 5e | ~70 files | 5-7 days | 5a, 5b, 5d |
| 5f | All files | 2-3 days | 5c, 5d, 5e |

**Total: ~14-20 days**

---

## Key Decisions

1. **No `ts-node` or build step for backend** — Use `tsx` for development (fast, ESM-native) and `tsc` only for type checking. The backend continues to run source directly.
2. **Skip ANTLR generated files** — They're auto-generated from `Agtype.g4`. Add `.d.ts` declarations instead.
3. **Skip `lib/cytoscape-cxtmenu`** — Vendored third-party code. Add a `.d.ts` declaration file.
4. **Refactor class components during migration** — The 3 class components become function components when converted to TypeScript.
5. **Refactor `connect()` containers** — Convert to hooks (`useSelector`/`useDispatch`) during migration. This eliminates the container/presentation split for simple cases.
6. **Start with `strict: false`** — Get everything compiling first, then ratchet up strictness in 5f.

---

## Risk Mitigation

- Each wave is independently deployable (mixed JS/TS works with `allowJs`)
- Tests continue to run at every step (Vitest handles both)
- CI type-checks on every PR (catches regressions)
- No runtime behavior changes — TypeScript is compile-time only
