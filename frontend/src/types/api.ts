/**
 * API response types for the AGE Viewer frontend.
 * These mirror the backend response shapes.
 */

/** Connection info returned by /api/v1/db/connect and /api/v1/db */
export interface ConnectionInfo {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  version: string;
  graphs: string[];
  graph: string;
}

/** Graph label metadata */
export interface GraphLabel {
  label: string;
  name: string;
  namespace: string;
  namespace_id: number;
  graphid: number;
  graph: number;
  id: number;
  kind: 'v' | 'e';
  cnt: number;
  relation: string;
  seq_name: string;
}

/** Property key */
export interface PropertyKey {
  key: string;
  key_type: 'v' | 'e';
}

/** Database role */
export interface DatabaseRole {
  user_name: string;
  role_name: string;
}

/** Single graph metadata */
export interface GraphMetadata {
  nodes?: GraphLabel[];
  edges?: GraphLabel[];
  propertyKeys?: PropertyKey[];
  graph?: string;
  database?: string;
  role?: DatabaseRole;
  id?: string; // Added client-side via crypto.randomUUID()
}

/** Metadata API response: map of graph name → metadata */
export type MetadataResponse = Record<string, GraphMetadata>;

/** Cypher query result */
export interface CypherResult {
  rows: unknown[];
  columns: string[];
  rowCount: number;
  command: string;
  key: string;
  query: string;
}

/** API error shape */
export interface ApiError {
  severity: string;
  message: string;
  code: string;
  statusText?: string;
}
