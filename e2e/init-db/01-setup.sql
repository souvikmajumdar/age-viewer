-- E2E Test Database Initialization
-- Creates AGE extension and configures search path

CREATE EXTENSION IF NOT EXISTS age;
LOAD 'age';
SET search_path = ag_catalog, "$user", public;

-- Grant necessary privileges to the test user
GRANT USAGE ON SCHEMA ag_catalog TO ageviewer_e2e;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA ag_catalog TO ageviewer_e2e;
ALTER DEFAULT PRIVILEGES IN SCHEMA ag_catalog GRANT ALL ON TABLES TO ageviewer_e2e;
