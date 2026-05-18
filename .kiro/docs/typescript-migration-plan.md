# Phase 5: TypeScript Migration Plan

**Date:** May 18, 2026  
**Scope:** 137 source files (27 backend + 110 frontend), ~13,600 lines of code  
**Strategy:** Incremental migration — file by file, strictness ratcheted up progressively

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

### 5a: TypeScript Infrastructure Setup
- [ ] Install TypeScript 5.x, `tsx` (for running .ts directly in Node)
- [ ] Create `backend/tsconfig.json` (ESM, Node 24, strict: false initially)
- [ ] Create `frontend/tsconfig.json` (JSX, Vite integration)
- [ ] Create `tsconfig.base.json` at root (shared compiler options)
- [ ] Install `@types/*` packages for all dependencies
- [ ] Configure Vite to handle `.ts`/`.tsx` files (already supported via plugin-react)
- [ ] Configure Vitest to handle TypeScript test files
- [ ] Update ESLint config for TypeScript (`@typescript-eslint/parser`)
- [ ] Add `tsc --noEmit` type-check command to CI
- [ ] Verify existing JS files still work with `allowJs: true`

### 5b: Shared Type Definitions
- [ ] Create `backend/src/types/` directory
  - [ ] `database.ts` — connection info, graph metadata, query results
  - [ ] `api.ts` — request/response shapes for all endpoints
  - [ ] `age.ts` — AGE-specific types (vertex, edge, path, agtype)
- [ ] Create `frontend/src/types/` directory
  - [ ] `api.ts` — API response types (shared with backend)
  - [ ] `redux.ts` — RootState, AppDispatch, typed hooks
  - [ ] `graph.ts` — cytoscape element types, legend data, layout options
  - [ ] `components.ts` — common prop interfaces
- [ ] Create typed Redux hooks (`useAppDispatch`, `useAppSelector`)

### 5c: Backend Migration (27 files → .ts)
**Order: bottom-up (dependencies first)**

- [ ] **Wave 1 — Pure utilities (no deps)**
  - [ ] `src/util/ObjectExtras.js` → `.ts`
  - [ ] `src/util/JsonBuilder.js` → `.ts`
  - [ ] `src/common/Routes.js` → `.ts`
  - [ ] `src/config/Pg.js` → `.ts`
  - [ ] `src/config/Flavors.js` → `.ts`
  - [ ] `src/config/winston.js` → `.ts`

- [ ] **Wave 2 — Models**
  - [ ] `src/models/QueryBuilder.js` → `.ts`
  - [ ] `src/models/GraphRepository.js` → `.ts`
  - [ ] `src/models/GraphCreator.js` → `.ts`

- [ ] **Wave 3 — Services**
  - [ ] `src/services/sessionService.js` → `.ts`
  - [ ] `src/services/cypherService.js` → `.ts`
  - [ ] `src/services/databaseService.js` → `.ts`
  - [ ] `src/services/queryList.js` → `.ts`

- [ ] **Wave 4 — Controllers & Routes**
  - [ ] `src/controllers/cypherController.js` → `.ts`
  - [ ] `src/controllers/databaseController.js` → `.ts`
  - [ ] `src/routes/cypherRouter.js` → `.ts`
  - [ ] `src/routes/databaseRouter.js` → `.ts`
  - [ ] `src/routes/miscellaneous.js` → `.ts`
  - [ ] `src/routes/sessionRouter.js` → `.ts`

- [ ] **Wave 5 — Entry point & tools**
  - [ ] `src/app.js` → `.ts`
  - [ ] `src/bin/www.js` → `.ts`
  - [ ] `src/tools/SQLFlavorManager.js` → `.ts`
  - [ ] `src/tools/AGEParser.js` → `.ts`
  - [ ] `src/tools/CustomAgTypeListener.js` → `.ts` (or `.d.ts` declaration)

- [ ] **Skip:** `AgtypeLexer.js`, `AgtypeParser.js`, `AgtypeListener.js` (ANTLR generated)

### 5d: Frontend Utilities & Redux
- [ ] **Redux store setup**
  - [ ] `src/app/store.js` → `.ts` (typed store)
  - [ ] `src/app/reducers.js` → `.ts`
  - [ ] Create `src/app/hooks.ts` (useAppDispatch, useAppSelector)

- [ ] **Redux slices** (10 files)
  - [ ] `features/alert/AlertSlice.js` → `.ts`
  - [ ] `features/editor/EditorSlice.js` → `.ts`
  - [ ] `features/frame/FrameSlice.js` → `.ts`
  - [ ] `features/layout/LayoutSlice.js` → `.ts`
  - [ ] `features/menu/MenuSlice.js` → `.ts`
  - [ ] `features/modal/ModalSlice.js` → `.ts`
  - [ ] `features/setting/SettingSlice.js` → `.ts`
  - [ ] `features/database/DatabaseSlice.js` → `.ts`
  - [ ] `features/database/MetadataSlice.js` → `.ts`
  - [ ] `features/cypher/CypherSlice.js` → `.ts`

- [ ] **Utilities & hooks**
  - [ ] `features/cookie/CookieUtil.js` → `.ts`
  - [ ] `features/cypher/CypherUtil.js` → `.ts`
  - [ ] `features/query_builder/KeyWordFinder.js` → `.ts`
  - [ ] `hooks/useNotification.jsx` → `.tsx`

### 5e: Frontend Components
**Order: leaf components first, then containers**

- [ ] **Wave 1 — Simple/leaf components**
  - [ ] Icons (5 files) → `.tsx`
  - [ ] `Alert.jsx` → `.tsx`
  - [ ] `NavigatorItem.jsx` → `.tsx`
  - [ ] `SidebarMeunuToggle.jsx` → `.tsx`
  - [ ] `CypherResultTab.jsx` → `.tsx` (refactor from class to function)
  - [ ] `CypherResultMeta.jsx` → `.tsx`

- [ ] **Wave 2 — Form/modal components**
  - [ ] `ServerConnectFrame.jsx` → `.tsx`
  - [ ] `ServerDisconnectFrame.jsx` → `.tsx`
  - [ ] `ServerStatusFrame.jsx` → `.tsx`
  - [ ] `GraphFilterModal.jsx` → `.tsx`
  - [ ] `EdgeThicknessMenu.jsx` → `.tsx`
  - [ ] `GraphInitializer.jsx` → `.tsx`
  - [ ] `BuilderContainer.jsx` → `.tsx`
  - [ ] `BuilderSelection.jsx` → `.tsx`
  - [ ] Modal components (5 files) → `.tsx`

- [ ] **Wave 3 — Complex components**
  - [ ] `Frame.jsx` → `.tsx`
  - [ ] `CypherResultTable.jsx` → `.tsx`
  - [ ] `CypherGraphResultFrame.jsx` → `.tsx`
  - [ ] `CypherResultCytoscapeFooter.jsx` → `.tsx`
  - [ ] `CypherResultCytoscapeLegend.jsx` → `.tsx` (refactor from class)
  - [ ] `CypherResultCytoscapeChart.jsx` → `.tsx`
  - [ ] `SidebarHome.jsx` → `.tsx`
  - [ ] `Editor.jsx` → `.tsx`
  - [ ] `Frames.jsx` → `.tsx`
  - [ ] `DefaultTemplate.jsx` → `.tsx`

- [ ] **Wave 4 — Container components (22 files)**
  - [ ] Refactor `connect()` → `useSelector`/`useDispatch` hooks
  - [ ] Convert all container files to `.tsx`
  - [ ] Remove container/presentation split where it adds no value

- [ ] **Wave 5 — Pages & App**
  - [ ] `App.jsx` → `.tsx`
  - [ ] `index.jsx` → `.tsx`
  - [ ] `MainPage.jsx` → `.tsx`

### 5f: Strict Mode & Cleanup
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
