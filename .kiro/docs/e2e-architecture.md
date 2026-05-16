# E2E Test Architecture

## Overview

```mermaid
flowchart TD
    A[npm run e2e] --> B[scripts/e2e-run.sh]
    B --> C[scripts/e2e-check-env.sh]
    C -->|ready| E[scripts/e2e-test.sh]
    C -->|not ready| D[scripts/e2e-setup-env.sh]
    D --> E
    E --> F[Start Backend :3001]
    E --> G[Start Frontend :3000]
    E --> H[Run Playwright Tests]
    F --> I[(PostgreSQL + AGE\n:5455)]
    H --> G
```

## Script Responsibilities

### Script 1: `e2e-run.sh` (Orchestrator)
- Entry point for `npm run e2e`
- Calls `e2e-check-env.sh`
- If not ready → calls `e2e-setup-env.sh`
- Then calls `e2e-test.sh`
- Handles cleanup on exit (stop services)

### Script 2: `e2e-check-env.sh` (Environment Validation)
- Checks Docker or Podman is available
- Checks if the test container is running
- Checks if PostgreSQL is accepting connections on port 5455
- Checks if AGE extension is loaded
- Returns exit code: 0 = ready, 1 = not ready

### Script 3: `e2e-setup-env.sh` (Provisioning)
- Detects Docker or Podman
- Pulls `apache/age:latest` image (if not cached)
- Starts container via docker-compose
- Waits for PostgreSQL readiness (`pg_isready`)
- Runs init SQL:
  - Creates test database (`ageviewer_e2e`)
  - Creates test user with RBAC (not superuser)
  - Grants necessary privileges
  - Creates AGE extension
  - Loads `ag_catalog` into search path

### Script 4: `e2e-test.sh` (Test Execution)
- Starts the backend server (background)
- Starts the frontend dev server or serves build (background)
- Waits for both to be ready
- Runs `npx playwright test`
- Captures exit code
- Stops background services
- Returns Playwright's exit code

## Database Configuration

```mermaid
erDiagram
    ROLE_ageviewer_e2e {
        string name "ageviewer_e2e"
        boolean superuser "false"
        boolean createdb "true"
        string password "ageviewer_e2e_pw"
    }
    DATABASE_ageviewer_e2e {
        string owner "ageviewer_e2e"
        string extensions "age"
    }
    ROLE_ageviewer_e2e ||--o{ DATABASE_ageviewer_e2e : owns
```

| Setting | Value | Rationale |
|---------|-------|-----------|
| Port | 5455 | Avoids conflict with local PostgreSQL on 5432 |
| User | `ageviewer_e2e` | Dedicated test user, not superuser |
| Password | `ageviewer_e2e_pw` (or `$E2E_DB_PASSWORD`) | From env var in CI |
| Database | `ageviewer_e2e` | Isolated test database |
| Privileges | `CREATE` on DB, `USAGE` on `ag_catalog` | Minimum required for AGE operations |

## CI Workflow

```mermaid
flowchart LR
    A[PR to development] --> B[e2e.yml triggered]
    B --> C[Service: apache/age container]
    B --> D[Install deps]
    D --> E[Build frontend]
    E --> F[Start backend]
    F --> G[Install Playwright browsers]
    G --> H[Run Playwright tests]
    H --> I[Upload test report artifact]
```

- Separate workflow file: `.github/workflows/e2e.yml`
- Triggered only on PRs to `development`
- Uses GitHub Actions service containers (native Docker support)
- Playwright report uploaded as artifact on failure

## Local vs CI Differences

| Aspect | Local | CI |
|--------|-------|-----|
| Container management | Docker/Podman via scripts | GitHub Actions service container |
| Port | 5455 (mapped) | 5432 (direct, service network) |
| Frontend | Vite dev server (:3000) | Static build served by backend |
| Browser install | Cached after first run | `npx playwright install --with-deps` |
| Cleanup | Script handles stop/remove | Container auto-removed after job |
