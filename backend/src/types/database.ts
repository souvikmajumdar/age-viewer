/**
 * Database connection and repository types for the AGE Viewer backend.
 */

/** Connection parameters provided by the client */
export interface ConnectionParams {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

/** Full connection info returned by GraphRepository */
export interface ConnectionInfo extends ConnectionParams {
  version: string;
  graphs: string[];
  graph: string;
}

/** Pool configuration for pg.Pool */
export interface PoolConnectionConfig extends ConnectionParams {
  version?: string;
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

/** Graph label metadata from ag_catalog */
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

/** Parsed metadata for a single graph */
export interface GraphMetadata {
  nodes: GraphLabel[];
  edges: GraphLabel[];
  propertyKeys: PropertyKey[];
  graph: string;
  database: string;
  role: DatabaseRole;
}

/** Property key info */
export interface PropertyKey {
  key: string;
  key_type: 'v' | 'e';
}

/** Database role info */
export interface DatabaseRole {
  user_name: string;
  role_name: string;
}

/** Metadata response: map of graph name → metadata (or empty object if not current) */
export type MetadataResponse = Record<string, Partial<GraphMetadata>>;
