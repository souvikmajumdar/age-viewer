# PostgreSQL Version Support Plan

**Date:** May 17, 2026  
**Context:** The app currently supports PostgreSQL 11-15 only. The E2E test infrastructure requires a compatible database. This plan addresses the gap.

---

## Current State

### App SQL Version Support

The backend loads version-specific SQL from `backend/sql/{major_version}/meta_data.sql`:

| Directory | PG Version | SQL Content | Status |
|-----------|-----------|-------------|--------|
| `sql/11/` | PostgreSQL 11 | Uses `g.oid` for graph join | **EOL** (Nov 2023) |
| `sql/12/` | PostgreSQL 12 | Uses `g.graphid` for graph join | **EOL** (Nov 2024) |
| `sql/13/` | PostgreSQL 13 | Same as 12 | **EOL** (Nov 2025) |
| `sql/14/` | PostgreSQL 14 | Same as 12 | EOL Nov 2026 |
| `sql/15/` | PostgreSQL 15 | Same as 12 | Supported until Nov 2027 |
| `sql/16/` | — | **MISSING** | Supported until Nov 2028 |
| `sql/17/` | — | **MISSING** | Supported until Nov 2029 |
| `sql/18/` | — | **MISSING** | Supported until Nov 2030 |

**Key finding:** PG 12-15 all use identical SQL. The only difference is PG 11 which uses `g.oid` instead of `g.graphid` (a schema change in AGE's `ag_graph` catalog table).

### PostgreSQL Lifecycle (as of May 2026)

| Version | Released | EOL | Status |
|---------|----------|-----|--------|
| 18 | Sep 2025 | Nov 2030 | **Current** |
| 17 | Sep 2024 | Nov 2029 | Active |
| 16 | Sep 2023 | Nov 2028 | Active |
| 15 | Oct 2022 | Nov 2027 | Active |
| 14 | Sep 2021 | Nov 2026 | Maintenance (6 months left) |
| 13 | Sep 2020 | Nov 2025 | **EOL** |
| 12 | Oct 2019 | Nov 2024 | **EOL** |
| 11 | Oct 2018 | Nov 2023 | **EOL** |

### Apache AGE Compatibility

| AGE Version | Supported PG Versions | Notes |
|-------------|----------------------|-------|
| 1.5.0 | 11, 12, 13, 14, 15 | Current in our Docker images |
| 1.6.0 | 15, 16 | Added PG 16 support |
| 1.7.0 | 16, 17, 18 | Latest — PG 17/18 support |

The `apache/age:latest` Docker image ships with **PG 18 + AGE 1.7.0**.

---

## Recommended Actions

### 1. Add SQL support for PG 16, 17, 18

Since PG 12-15 all use identical SQL (the `g.graphid` join), and PG 16-18 use the same AGE catalog schema, we simply need to copy the SQL files:

```
cp -r backend/sql/15/ backend/sql/16/
cp -r backend/sql/15/ backend/sql/17/
cp -r backend/sql/15/ backend/sql/18/
```

**Verification needed:** Confirm that the `ag_graph` catalog table schema hasn't changed in AGE 1.6/1.7 for PG 16-18. If it has, the SQL may need adjustment.

### 2. Drop support for EOL PostgreSQL versions

| Version | Action | Rationale |
|---------|--------|-----------|
| PG 11 | **Remove** | EOL since Nov 2023 (2.5 years ago) |
| PG 12 | **Remove** | EOL since Nov 2024 (1.5 years ago) |
| PG 13 | **Remove** | EOL since Nov 2025 (6 months ago) |
| PG 14 | **Keep** (deprecation warning) | EOL in 6 months (Nov 2026) |
| PG 15-18 | **Supported** | Active maintenance |

### 3. Update E2E test infrastructure

- Change Docker image from `apache/age:latest` (PG 18) to `apache/age:PG16` or verify PG 18 works after adding SQL support
- Document minimum supported PG version in README

### 4. Add version validation in the backend

The `SQLFlavorManager.js` should:
- Log a warning for unsupported versions
- Provide a clear error message instead of crashing with "SQL does not exist"
- Optionally: fall back to the latest supported version's SQL with a warning

---

## Implementation Order

1. **Add `sql/16/`, `sql/17/`, `sql/18/` directories** (copy from `sql/15/`)
2. **Verify** the SQL works against PG 16/17/18 with AGE extension
3. **Remove `sql/11/`, `sql/12/`, `sql/13/`** (EOL versions)
4. **Update `SQLFlavorManager.js`** — add version validation and clear error for unsupported versions
5. **Update E2E infrastructure** — use `apache/age:latest` (PG 18) now that it's supported
6. **Update README** — document supported PG versions (14-18)
7. **Update backlog** — add this as a prerequisite for Phase 4f-ii

---

## E2E Docker Image Decision

| Image Tag | PG Version | AGE Version | ARM64 Support | Recommendation |
|-----------|-----------|-------------|---------------|----------------|
| `apache/age:latest` | 18 | 1.7.x | ✅ | Use after adding sql/18/ |
| `apache/age:release_PG16_1.5.0` | 16 | 1.5.0 | ❌ (amd64 only) | Not suitable for local dev on Apple Silicon |
| `apache/age:release_PG15_1.5.0` | 15 | 1.5.0 | ❌ (amd64 only) | Not suitable |
| `apache/age:dev_snapshot_PG16` | 16 | dev | Unknown | Not stable |

**Decision:** Use `apache/age:latest` (PG 18, ARM64 native) after adding the `sql/18/` directory. This gives us the best local dev experience on Apple Silicon and tests against the current PostgreSQL version.
