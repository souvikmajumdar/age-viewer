# Apache AGE Viewer — Update Plan

**Date:** May 15, 2026  
**Last Commit:** March 22, 2024 (`Fix Metadata Load Error in PG v13, v14 and v15`)  
**Time Since Last Update:** ~14 months  

---

## Decisions Made

| Question | Decision | Rationale |
|----------|----------|-----------|
| React version | **React 19** | GA since April 2024, Carbon supports it, security patches active |
| Build tool | **Vite** | Fast, lightweight, perfect for SPA/dashboard apps |
| Babel | **Drop — Native ESM** | Targeting Node 24+, no need for Babel transpilation |
| Design system | **IBM Carbon** (`@carbon/react`) | Replace both Ant Design and Bootstrap with unified Carbon system |
| TypeScript | **Phase 5** (future) | Agreed as a later improvement |

---

## React 19 — Status & Assessment

**Status:** React 19 is **GA** (stable since April 2024). Multiple patch releases have been issued (19.0.1, 19.1.2, 19.2.1, 19.2.6). The React Compiler now targets React 19 by default.

**Why React 19 is the right target:**
- Stable for over a year with active security patching
- `@carbon/react` (v1.107.1) explicitly supports `^19.0.0` as a peer dependency
- Cytoscape.js and react-cytoscapejs 2.0 support React 18+/19
- New features (Actions, `use()`, Server Components) provide future optionality

**Potential challenges for this project:**
- **`react-cytoscapejs`** — v2.0 supports React 18+; verify React 19 compatibility (likely fine since it uses refs/effects, not class lifecycle)
- **Redux/RTK** — `@reduxjs/toolkit` 2.x + `react-redux` 9.x support React 19; the `useSyncExternalStore` hook is stable
- **CodeMirror** — `@uiw/react-codemirror` 4.x uses hooks; should work with React 19
- **Removed APIs** — React 19 removes `defaultProps` for function components, `propTypes` runtime checking, and legacy context. This project uses `prop-types` extensively — those imports become dead code (no runtime errors, just unused)
- **`ref` as prop** — React 19 passes ref as a regular prop; `forwardRef` is no longer needed but still works
- **Strict Mode double-rendering** — Already in use (`<React.StrictMode>` in App.jsx), so no new surprises

**Verdict:** No blocking issues. The main work is removing `prop-types` (optional cleanup) and ensuring third-party graph visualization libraries work correctly.

---

## Next.js vs Vite — Decision

**Decision: Vite.**

AGE Viewer is a client-side dashboard/tool that talks to a separate Express backend. It has no SEO requirements, no public-facing pages, and no need for server-side rendering. Vite is the right fit:

- Sub-2-second cold start, instant HMR
- Minimal configuration, drop-in CRA replacement
- Carbon's docs explicitly cover Vite + Sass setup
- No routing opinions imposed — keeps the existing SPA architecture
- Lighter deployment (static build served by Express or any static host)

Next.js would add unnecessary complexity (SSR, file-based routing, server components, deployment constraints) for zero benefit in this use case.

---

## Design System — Ant Design vs IBM Carbon vs Alternatives

### Current Ant Design Usage in This Project

Ant Design is used across **14 files** for **17 unique components**:

| Category | Components | Where Used |
|----------|-----------|------------|
| **Forms** | Form, Input, InputNumber, Button | Server connection dialog |
| **Layout** | Row, Col, Space, Divider | Page layouts, metadata display |
| **Overlays** | Modal, Drawer, Popover | Graph filters, query builder, edge config |
| **Data Display** | Table, Alert | Query results, notifications |
| **Inputs** | Select, Checkbox, Upload | Sidebar, filters, CSV import |
| **Feedback** | message (toast utility) | Success/error notifications |

No theming or customization is applied — just default antd styles imported globally. Bootstrap is also used alongside antd (mixed usage).

### Comprehensive Comparison

| Criteria | Ant Design (v5/6) | IBM Carbon (`@carbon/react`) | Radix + shadcn/ui |
|----------|-------------------|------------------------------|-------------------|
| **Maintainer** | Ant Group (Alibaba) | IBM | Community (Radix: WorkOS) |
| **React 19 support** | ✅ v6 | ✅ v1.107+ | ✅ |
| **Component count** | ~70+ | ~50+ | ~40+ (headless) |
| **Table component** | Excellent (virtual scroll, sort, filter) | Good (DataTable with sort, filter, pagination) | Basic (need TanStack Table) |
| **Form handling** | Built-in Form with validation | Uses native form patterns | Bring your own (react-hook-form) |
| **Modal/Dialog** | ✅ Full-featured | ✅ ComposedModal, Modal | ✅ Dialog primitive |
| **Select/Dropdown** | ✅ Searchable, multi-select | ✅ Dropdown, MultiSelect, ComboBox | ✅ Headless |
| **Theming** | Token-based (CSS-in-JS in v5+) | Sass tokens, CSS custom properties | Tailwind CSS |
| **Accessibility** | Good | Excellent (IBM accessibility standards) | Excellent (WAI-ARIA) |
| **Bundle size** | Large (~200KB+ gzipped for full) | Medium (~150KB+ with tree-shaking) | Small (only what you use) |
| **Design language** | Chinese enterprise aesthetic | IBM's design language (clean, professional) | Unstyled / custom |
| **Documentation** | Extensive (Chinese-first, English available) | Extensive (English, IBM-focused) | Good (code-first) |
| **Sass support** | CSS-in-JS (v5+), less (v4) | ✅ Dart Sass (native) | Tailwind |
| **Enterprise adoption** | Alibaba ecosystem | IBM, many enterprise products | Startups, indie |
| **Graph/visualization** | No built-in | No built-in | No built-in |
| **IBM alignment** | ❌ | ✅ IBM's own system | ❌ |

### Carbon Component Mapping for This Project

| Current (antd) | Carbon Equivalent | Notes |
|----------------|-------------------|-------|
| `Button` | `Button` | Direct replacement |
| `Input` | `TextInput` | Similar API |
| `InputNumber` | `NumberInput` | Direct replacement |
| `Form` | Native form + `FormGroup`, `FormLabel` | Carbon is less opinionated about form state |
| `Select` | `Dropdown`, `ComboBox`, `MultiSelect` | More specialized variants |
| `Table` | `DataTable` + `Table`, `TableHead`, `TableRow`, etc. | Composable pattern (more verbose but flexible) |
| `Modal` | `Modal`, `ComposedModal` | Direct replacement |
| `Drawer` | `SidePanel` (from `@carbon/ibm-products`) | Slightly different pattern |
| `Alert` | `InlineNotification`, `ToastNotification` | More variants available |
| `message` (toast) | `ToastNotification` | Need to manage placement yourself |
| `Row`, `Col` | `Grid`, `Column`, `Row` (CSS Grid-based) | 16-column grid system |
| `Checkbox` | `Checkbox` | Direct replacement |
| `Upload` | `FileUploader` | Direct replacement |
| `Popover` | `Popover`, `Tooltip` | Direct replacement |
| `Divider` | CSS or custom | No dedicated component |
| `Space` | CSS flex/gap | No dedicated component |

### Recommendation: IBM Carbon

**Why Carbon is the right choice for this project:**
1. **IBM alignment** — If this is an IBM project, Carbon is the standard
2. **React 19 ready** — Peer dependency explicitly includes `^19.0.0`
3. **Replaces both antd AND Bootstrap** — Carbon has its own grid, typography, and spacing system
4. **Accessibility** — Built to IBM's accessibility standards (WCAG 2.1 AA)
5. **Sass-native** — Already using Sass in this project; Carbon uses Dart Sass tokens
6. **Professional aesthetic** — Clean, enterprise-appropriate design language
7. **Active maintenance** — Regular releases (v1.107.1 as of May 2026)

**Trade-offs:**
- Carbon's `DataTable` is more verbose than antd's `Table` (composable pattern vs config-driven)
- No built-in form validation (pair with react-hook-form or similar)
- No imperative toast API (see Toast/Notification Strategy below)
- Slightly smaller component library than antd (but covers all needs here)

---

## Toast/Notification Strategy — Carbon Gap Analysis

### The Problem

Ant Design provides an **imperative** `message` API:
```js
message.success('File uploaded successfully');
message.error('Upload failed.');
```

Carbon provides a **declarative** `ToastNotification` component — you render it in JSX, but there's no `toast.show()` function you can call from anywhere in your code.

### Current Usage in This Project (3 call sites)

| File | Usage | Context |
|------|-------|---------|
| `GraphFilterModal.jsx` | `message.error('cannot leave with empty property.')` | Form validation feedback |
| `csv/index.jsx` | `message.success('file uploaded successfully')` | Upload success |
| `csv/index.jsx` | `message.error('file upload failed.')` | Upload failure |

### Solution: Notification Context + Carbon ToastNotification

Since the usage is minimal (3 call sites), we'll build a lightweight notification system using React context that renders Carbon's `ToastNotification` components.

**Architecture:**

```
NotificationProvider (context + state)
  └── renders ToastNotification stack (positioned fixed, top-right)
  └── exposes useNotification() hook
       └── { notify, success, error, warning, info }
```

**Implementation plan:**

1. **Create `NotificationProvider`** — a context provider that manages a queue of notifications
2. **Create `useNotification` hook** — returns imperative methods (`success()`, `error()`, etc.)
3. **Render `ToastNotification` components** from the queue with auto-dismiss (timeout)
4. **Wrap app** in `<NotificationProvider>` at the root
5. **Replace** `message.success(...)` → `notify.success(...)` at the 3 call sites

**Example usage after migration:**
```jsx
import { useNotification } from '@/hooks/useNotification';

function CsvUpload() {
  const notify = useNotification();
  
  const onUpload = (info) => {
    if (info.file.status === 'done') {
      notify.success(`${info.file.name} uploaded successfully`);
    } else if (info.file.status === 'error') {
      notify.error(`${info.file.name} upload failed.`);
    }
  };
}
```

**Why this is low-risk:**
- Only 3 call sites to migrate
- Carbon's `ToastNotification` handles the visual rendering, accessibility, and close behavior
- We only need ~50 lines of context/hook code
- Pattern is well-established in the React ecosystem
- No external toast library needed

**Alternative considered:** Using a third-party toast library (react-toastify, sonner). Rejected because:
- Adds a dependency outside the Carbon design system
- Visual inconsistency with Carbon's design language
- Carbon already has the `ToastNotification` component — we just need the state management layer

---

## Project Summary

Apache AGE Viewer is a web-based graph visualization tool for PostgreSQL with the AGE extension. It's a monorepo with:

- **Root** — orchestration scripts via `npm-run-all`
- **Backend** — Express.js API with Babel transpilation, ANTLR4 for AGE type parsing, PostgreSQL driver
- **Frontend** — React 17 app (Create React App), Redux, Ant Design, Cytoscape.js for graph rendering

---

## Current State Assessment

### Critical Issues

| Area | Current | Problem |
|------|---------|---------|
| Node.js | Pinned to `^14.16.0` | Node 14 reached EOL on April 30, 2023. No security patches. |
| Dockerfile | `node:14-alpine3.16` | EOL base image with known vulnerabilities |
| CI/CD | `node-version: [14.x]` | Running on unsupported runtime |
| React | `^17.0.2` | Two major versions behind (current: 19.x) |
| Express | `~4.17.1` | Express 5 is now stable |
| react-scripts (CRA) | `^4.0.3` | CRA is effectively unmaintained; 5.0.1 is the last release |

### Security Concerns

- **axios `^0.21.1`** — Known CVEs in pre-1.x versions (SSRF, prototype pollution)
- **ejs `^3.1.6`** — Multiple template injection CVEs patched in later versions
- **express `~4.17.1`** — Several security patches released since 4.17.1
- **serve `^11.3.2`** — Outdated, multiple security fixes in later versions
- **multer `^1.4.2`** — Denial of service vulnerability patched in 1.4.4+

---

## Backend — Outdated Packages

### Major Version Bumps (Breaking Changes Expected)

| Package | Current | Latest | Notes |
|---------|---------|--------|-------|
| `antlr4` | 4.9.3 | 4.13.2 | API changes; parser regeneration likely needed |
| `chai` | ^4.3.7 | 6.2.2 | ESM-only in v5+; test rewrite needed |
| `csv` | ^5.5.0 | 6.5.1 | API restructured |
| `ejs` | ^3.1.6 | 5.0.2 | Major template engine changes |
| `express` | ~4.17.1 | 5.2.1 | Middleware/routing API changes |
| `http-status` | ^1.5.0 | 2.1.0 | API changes |
| `multer` | ^1.4.2 | 2.1.1 | Storage engine API changes |
| `uuid` | ^8.3.2 | 14.0.0 | Import path changes |
| `winston-daily-rotate-file` | ^4.5.0 | 5.0.0 | Configuration changes |
| `pg-types` | ^2.2.0 | 4.1.0 | Type parsing changes |
| `mocha` | ^8.2.1 | 11.x | Test runner config changes |
| `supertest` | ^6.0.1 | 7.x | Minor API changes |
| `nodemon` | ^2.0.7 | 3.x | Config format changes |

### Minor/Patch Updates (Safe to Update)

| Package | Current | Latest | Notes |
|---------|---------|--------|-------|
| `cors` | ^2.8.5 | 2.8.6 | Patch |
| `cookie-parser` | ~1.4.5 | 1.4.7 | Patch |
| `debug` | ~4.3.1 | 4.4.3 | Minor |
| `express-session` | ^1.17.1 | 1.19.0 | Minor |
| `morgan` | ~1.10.0 | 1.10.1 | Patch |
| `papaparse` | ^5.3.2 | 5.5.3 | Minor |
| `pg` | ^8.5.1 | 8.20.0 | Minor |
| `winston` | ^3.3.3 | 3.19.0 | Minor |
| `@babel/*` packages | ^7.12.x | 7.27.x | Minor (keep together) |

### Deprecated/Unmaintained

| Package | Status | Replacement |
|---------|--------|-------------|
| `pegjs` | ^0.10.0 — abandoned | `peggy` (maintained fork) |
| `@babel/plugin-proposal-class-properties` | Merged into Babel core | `@babel/plugin-transform-class-properties` (or remove if targeting modern Node) |
| `npm-run-all` | Unmaintained | `npm-run-all2` (community fork) |

---

## Frontend — Outdated Packages

### Major Version Bumps (Breaking Changes Expected)

| Package | Current | Latest | Notes |
|---------|---------|--------|-------|
| `react` / `react-dom` | ^17.0.2 | 19.2.6 | Major rewrite of internals; concurrent features |
| `react-scripts` | ^4.0.3 | 5.0.1 | Webpack 5 migration; CRA itself is unmaintained |
| `antd` | ^4.12.3 | 6.4.2 | Complete design system overhaul in v5 |
| `@reduxjs/toolkit` | ^1.5.0 | 2.12.0 | API changes, new patterns |
| `react-redux` | ^7.2.4 | 9.3.0 | Hooks-first API |
| `redux` | ^4.0.5 | 5.0.1 | Middleware changes |
| `redux-thunk` | ^2.3.0 | 3.1.0 | Bundled with RTK 2.x |
| `bootstrap` | ^4.6.0 | 5.3.8 | jQuery removed, utility-first approach |
| `react-bootstrap` | ^1.4.3 | 2.10.10 | Bootstrap 5 support |
| `axios` | ^0.21.1 | 1.16.1 | Interceptor/config changes |
| `@fortawesome/*` | ^1.2.x / ^5.15.x | 7.2.0 | Complete package restructure |
| `@uiw/react-codemirror` | 3.0.5 | 4.25.9 | CodeMirror 6 migration |
| `codemirror` | 5.59.0 | 6.0.2 | Complete rewrite |
| `serve` | ^11.3.2 | 14.2.6 | CLI changes |
| `react-cytoscapejs` | ^1.2.1 | 2.0.0 | React 18+ support |
| `eslint` | ^7.32.0 | 9.x | Flat config migration |

### Minor/Patch Updates (Safe to Update)

| Package | Current | Latest | Notes |
|---------|---------|--------|-------|
| `cytoscape` | ^3.18.0 | 3.33.3 | Minor (layout plugins compatible) |
| `papaparse` | ^5.3.2 | 5.5.3 | Minor |
| `prop-types` | ^15.7.2 | 15.8.1 | Patch |
| `sass` | ^1.38.2 | 1.87.x | Minor |

---

## Infrastructure & Tooling Updates

### Node.js Runtime

**Node.js release schedule (as of May 2026):**

| Version | Status | Active LTS Ends | Maintenance Ends | Recommendation |
|---------|--------|-----------------|------------------|----------------|
| **26** | Current (released May 5, 2026) | Upcoming LTS (Oct 2026) | ~Apr 2029 | Too new for production target |
| **24** | **Active LTS** | Oct 20, 2026 | Apr 30, 2028 | ✅ **Recommended target** |
| **22** | Maintenance LTS | Ended Oct 2025 | Apr 30, 2027 | Acceptable but entering maintenance |
| **20** | EOL | Ended Oct 2024 | Ended Apr 30, 2026 | ❌ Just reached EOL |

**Note:** Node.js is evolving its release schedule — starting with Node 27, every release will become LTS (no more odd/even distinction).

**Decision: Target Node.js 24.x LTS**

| Item | Current | Target |
|------|---------|--------|
| Node.js version | 14.x (EOL since Apr 2023) | **24.x LTS** (maintained until Apr 2028) |
| Dockerfile base | `node:14-alpine3.16` | `node:24-alpine` |
| CI matrix | `[14.x]` | `[24.x]` (add 26.x when it enters LTS) |
| `engines` field | `^14.16.0` | `>=24.0.0` |

### Build Tooling

| Item | Current | Target |
|------|---------|--------|
| Frontend build | Create React App (CRA) | **Vite** + `@vitejs/plugin-react` |
| Backend transpilation | Babel (full pipeline) | **Drop Babel** — Native ESM (Node 24 supports everything natively) |
| Package manager | npm with `npm-run-all` | npm with `npm-run-all2` (or pnpm workspaces) |
| CI actions | `actions/checkout@v2`, `actions/setup-node@v2` | Update to `@v4` |

---

## Recommended Update Strategy

### Phase 1: Foundation (Low Risk)

1. **Update Node.js target** to 24.x LTS
   - Update `engines` in root `package.json` to `>=24.0.0`
   - Update Dockerfile to `node:24-alpine`
   - Update CI workflow to test on `[24.x]`
   - Update CI actions to v4

2. **Apply safe minor/patch updates** in both frontend and backend
   - `pg`, `winston`, `cors`, `debug`, `cytoscape`, `papaparse`, etc.

3. **Replace deprecated packages**
   - `pegjs` → `peggy`
   - `npm-run-all` → `npm-run-all2`
   - Remove `@babel/plugin-proposal-class-properties`

### Phase 2: Backend Modernization — Native ESM (Medium Risk)

4. **Drop Babel entirely** — Convert backend to native ESM
   - Add `"type": "module"` to backend `package.json`
   - Convert `require()` → `import` statements
   - Update file extensions if needed (`.mjs` or keep `.js` with type module)
   - Remove all `@babel/*` dev dependencies
   - Update scripts (no more `babel-node`, just `node`)

5. **Update Express** to 5.x
   - Review middleware compatibility
   - Update error handling patterns

6. **Update `antlr4`** to 4.13.x
   - Regenerate parser from grammar file (`Agtype.g4`)
   - Update `CustomAgTypeListener.js` for API changes

7. **Update test stack**
   - `mocha` → latest or migrate to `vitest` (ESM-native)
   - `chai` → 5.x+ (ESM-only)
   - `supertest` → 7.x

8. **Update remaining backend deps**
   - `uuid`, `multer`, `ejs`, `csv`, `http-status`

### Phase 3: Frontend Modernization (High Risk, High Reward)

9. **Migrate from CRA to Vite**
   - Replace `react-scripts` with `vite` + `@vitejs/plugin-react`
   - Configure Vite for Sass (needed for Carbon)
   - Set up proxy to backend in `vite.config.js`

10. **Update React to 19.x**
    - Replace `ReactDOM.render` with `createRoot`
    - Update `react-redux` to 9.x and `@reduxjs/toolkit` to 2.x together
    - Remove `redux-thunk` (bundled in RTK 2.x)
    - Remove `prop-types` (no longer enforced at runtime in React 19)
    - Test Cytoscape rendering with concurrent features

11. **Replace Ant Design + Bootstrap with IBM Carbon**
    - Install `@carbon/react` and `@carbon/ibm-products`
    - Build `NotificationProvider` + `useNotification` hook for toast support
    - Migrate components file-by-file using the mapping table above
    - Remove `antd`, `bootstrap`, `react-bootstrap`, and their CSS imports
    - Set up Carbon Sass tokens for theming
    - Replace Font Awesome with `@carbon/icons-react`

12. **Update CodeMirror** to 6.x + `@uiw/react-codemirror` 4.x
    - Complete API rewrite; extensions-based architecture

13. **Update axios** to 1.x
    - Interceptor API changes

14. **Update `react-cytoscapejs`** to 2.x
    - Verify React 19 compatibility

### Phase 4: Cleanup & Optimization

15. **Update ESLint** to 9.x with flat config
16. **Audit bundle size** after all updates
17. **Update Docker compose** for test environment
18. **Remove unused packages** (`serve`, `pegjs`, `prop-types`, all Font Awesome packages)

### Phase 5: TypeScript Migration (Future)

19. **Add TypeScript** incrementally
    - Start with new files, gradually convert existing
    - Add `tsconfig.json` with strict mode
    - Leverage Carbon's TypeScript definitions

---

## Risk Assessment

| Phase | Risk | Effort | Impact |
|-------|------|--------|--------|
| Phase 1 | Low | 1-2 days | Unblocks everything; fixes security baseline |
| Phase 2 | Medium | 3-5 days | Backend stability, security, modern ESM |
| Phase 3 | High | 3-4 weeks | Modern frontend, IBM Carbon design, React 19, toast system |
| Phase 4 | Low | 1-2 days | Code quality and maintainability |
| Phase 5 | Medium | Ongoing | Type safety, better DX |

---

## References

- [Node.js Release Schedule](https://nodejs.org/en/about/previous-releases)
- [Express 5 Migration Guide](https://expressjs.com/en/guide/migrating-5.html)
- [React 19 Blog Post](https://react.dev/blog/2024/04/25/react-19)
- [Vite Migration from CRA](https://vitejs.dev/guide/migration)
- [IBM Carbon React — Getting Started](https://carbondesignsystem.com/developing/frameworks/react/)
- [Carbon Component Documentation](https://react.carbondesignsystem.com/)
- [@carbon/react on npm](https://www.npmjs.com/package/@carbon/react)
