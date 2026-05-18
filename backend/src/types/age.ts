/**
 * Apache AGE-specific types for graph data structures.
 */

/** AGE vertex ID */
export interface AgeId {
  oid: number;
  id: number;
}

/** Raw AGE vertex from parser */
export interface AgeVertex {
  label: string;
  id: AgeId;
  props: Record<string, unknown>;
}

/** Raw AGE edge from parser */
export interface AgeEdge {
  label: string;
  id: AgeId;
  start: AgeId;
  end: AgeId;
  props: Record<string, unknown>;
}

/** Raw AGE path from parser */
export interface AgePath {
  vertices: AgeVertex[];
  edges: AgeEdge[];
  start: AgeId;
  end: AgeId;
  len: number;
}

/** Converted vertex (after CypherService processing) */
export interface ConvertedVertex {
  label: string;
  id: string; // "oid.id" format
  properties: Record<string, unknown>;
}

/** Converted edge (after CypherService processing) */
export interface ConvertedEdge {
  label: string;
  id: string; // "oid.id" format
  start: string; // "oid.id" format
  end: string; // "oid.id" format
  properties: Record<string, unknown>;
}

/** A converted path is an array of vertices and edges */
export type ConvertedPath = (ConvertedVertex | ConvertedEdge)[];

/** Query result from GraphRepository.execute() */
export interface QueryResult {
  rows: Record<string, unknown>[];
  fields: Array<{ name: string }>;
  rowCount: number;
  command: string;
}

/** Graph creation query structure */
export interface GraphCreationQueries {
  graph: {
    drop: string | null;
    create: string | null;
  };
  labels: string[];
  nodes: string[];
  edges: string[];
}
