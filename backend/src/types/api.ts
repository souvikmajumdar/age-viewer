/**
 * API request/response types for the AGE Viewer backend.
 */

import type { Request, Response, NextFunction } from 'express';
import type { ConnectionInfo } from './database.js';

/** Express request with typed body */
export interface TypedRequest<T = unknown> extends Request {
  body: T;
}

/** Connect request body */
export interface ConnectRequestBody {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

/** Connect response — same as ConnectionInfo */
export type ConnectResponse = ConnectionInfo;

/** Metadata request body */
export interface MetadataRequestBody {
  currentGraph?: string;
}

/** Cypher query request body */
export interface CypherRequestBody {
  cmd: string;
}

/** Cypher query response */
export interface CypherResponse {
  rows: unknown[];
  columns: string[];
  rowCount: number;
  command: string;
}

/** Graph creation request (multipart form) */
export interface CreateGraphBody {
  graphName: string;
  dropGraph: string; // 'true' | 'false'
}

/** Standard error response */
export interface ErrorResponse {
  severity: string;
  message: string;
  code: string;
  details?: string;
}

/** Express async handler wrapper type */
export type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;
