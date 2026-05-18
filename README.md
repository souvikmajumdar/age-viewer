[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![License](https://img.shields.io/github/license/apache/age-viewer)](LICENSE)

# Apache AGE Viewer

A web-based graph visualization tool for PostgreSQL databases with the [Apache AGE](https://age.apache.org/) extension.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 24.x LTS |
| Frontend | React 19, Vite, IBM Carbon Design System |
| State | Redux Toolkit 2.x |
| Graph | Cytoscape.js |
| Editor | CodeMirror 6 |
| Backend | Express 4.x, native ESM |
| Database | PostgreSQL 14-18 with Apache AGE |

## Prerequisites

- **Node.js** >= 24.0.0 ([download](https://nodejs.org/))
- **Docker** or **Podman** (for the PostgreSQL + AGE database)

## Quick Start

### 1. Set up the database

<details>
<summary><strong>Using Docker</strong></summary>

```bash
# Pull the Apache AGE image
docker pull apache/age:latest

# Start the container
docker run -d \
  --name age-viewer-db \
  -p 5455:5432 \
  -e POSTGRES_USER=ageviewer \
  -e POSTGRES_PASSWORD=ageviewer_pw \
  -e POSTGRES_DB=ageviewer \
  apache/age:latest

# Wait for it to be ready
docker exec age-viewer-db pg_isready -U ageviewer -d ageviewer

# Initialize the AGE extension
docker exec age-viewer-db psql -U ageviewer -d ageviewer -c "CREATE EXTENSION IF NOT EXISTS age;"
docker exec age-viewer-db psql -U ageviewer -d ageviewer -c "LOAD 'age';"
```

</details>

<details>
<summary><strong>Using Podman</strong></summary>

```bash
# Pull the Apache AGE image
podman pull docker.io/apache/age:latest

# Start the container
podman run -d \
  --name age-viewer-db \
  -p 5455:5432 \
  -e POSTGRES_USER=ageviewer \
  -e POSTGRES_PASSWORD=ageviewer_pw \
  -e POSTGRES_DB=ageviewer \
  docker.io/apache/age:latest

# Wait for it to be ready
podman exec age-viewer-db pg_isready -U ageviewer -d ageviewer

# Initialize the AGE extension
podman exec age-viewer-db psql -U ageviewer -d ageviewer -c "CREATE EXTENSION IF NOT EXISTS age;"
podman exec age-viewer-db psql -U ageviewer -d ageviewer -c "LOAD 'age';"
```

</details>

### 2. Install dependencies

```bash
npm run setup
```

This installs dependencies for the root, backend, and frontend.

### 3. Start the application

```bash
npm run start
```

This starts both the backend (port 3001) and frontend (port 3000) concurrently.

Open **http://localhost:3000** in your browser.

### 4. Connect to the database

In the connection form, enter:

| Field | Value |
|-------|-------|
| Connect URL | `localhost` |
| Connect Port | `5455` |
| Database Name | `ageviewer` |
| User Name | `ageviewer` |
| Password | `ageviewer_pw` |

Click **Connect**.

## Development

### Start in development mode

```bash
# Backend with hot-reload
cd backend && npm run start:dev

# Frontend with Vite HMR (separate terminal)
cd frontend && npm run start
```

### Run tests

```bash
# Backend unit tests
cd backend && npm test

# Frontend unit tests
cd frontend && npm test

# E2E tests (requires Docker/Podman)
export E2E_DB_PASSWORD=your_test_password
npm run e2e
```

### Lint & Format

```bash
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix
npm run format        # Format with Prettier
npm run format:check  # Verify formatting
```

### Build for production

```bash
cd frontend && npm run build
```

The production build is output to `frontend/build/`. The backend serves it automatically.

## Project Structure

```
age-viewer/
├── backend/           # Express API server (native ESM)
│   ├── src/
│   │   ├── bin/       # Entry point (www.js)
│   │   ├── config/    # Database, logging config
│   │   ├── controllers/
│   │   ├── models/    # GraphRepository, QueryBuilder
│   │   ├── routes/    # API routes
│   │   ├── services/  # Business logic
│   │   └── tools/     # AGE parser (ANTLR4)
│   ├── sql/           # Version-specific SQL (PG 14-18)
│   └── test/          # Vitest tests
├── frontend/          # React SPA (Vite)
│   ├── src/
│   │   ├── app/       # Redux store
│   │   ├── components/
│   │   ├── features/  # Redux slices
│   │   ├── hooks/     # Custom hooks
│   │   └── test/      # Vitest + RTL tests
│   └── vite.config.js
├── e2e/               # Playwright E2E tests
├── scripts/           # E2E orchestration scripts
├── .kiro/             # Project documentation
│   ├── docs/          # Plans, backlog, architecture
│   └── steering/      # Development guidelines
└── playwright.config.js
```

## Supported PostgreSQL Versions

| Version | Status |
|---------|--------|
| 18 | ✅ Supported (Current) |
| 17 | ✅ Supported |
| 16 | ✅ Supported |
| 15 | ✅ Supported |
| 14 | ✅ Supported (EOL Nov 2026) |
| 13 and below | ❌ Not supported (EOL) |

## Creating a Test Graph

After connecting, you can create a graph using Cypher queries in the editor:

```sql
-- Create a graph
SELECT * FROM ag_catalog.create_graph('my_graph');

-- Create nodes
SELECT * FROM cypher('my_graph', $$ CREATE (n:Person {name: 'Alice', age: 30}) RETURN n $$) as (n agtype);
SELECT * FROM cypher('my_graph', $$ CREATE (n:Person {name: 'Bob', age: 25}) RETURN n $$) as (n agtype);

-- Create an edge
SELECT * FROM cypher('my_graph', $$
  MATCH (a:Person {name: 'Alice'}), (b:Person {name: 'Bob'})
  CREATE (a)-[r:KNOWS {since: 2020}]->(b)
  RETURN r
$$) as (r agtype);

-- Query the graph
SELECT * FROM cypher('my_graph', $$ MATCH (a)-[r]->(b) RETURN a, r, b $$) as (a agtype, r agtype, b agtype);
```

## Stopping the database

```bash
# Docker
docker stop age-viewer-db && docker rm age-viewer-db

# Podman
podman stop age-viewer-db && podman rm age-viewer-db
```

## License

Apache AGE Viewer is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for the full license text.
