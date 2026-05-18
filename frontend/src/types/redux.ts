/**
 * Redux state types and typed hooks for the AGE Viewer frontend.
 */

import type { GraphLabel, PropertyKey, GraphMetadata } from './api';

// ─── Slice State Types ───

export interface DatabaseState {
  status: 'init' | 'connected' | 'disconnected';
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  graph?: string;
}

export interface MetadataState {
  graphs: Record<string, GraphMetadata & { id?: string }>;
  status: 'init' | 'connected' | 'disconnected';
  dbname: string;
  currentGraph: string;
}

export interface CypherQueryResult {
  command: string;
  complete: boolean;
  requestId?: string;
  key?: string;
  query?: string;
  rows?: unknown[];
  columns?: string[];
  rowCount?: number;
  message?: string;
}

export interface CypherLabels {
  nodeLabels: Record<string, Record<string, unknown>>;
  edgeLabels: Record<string, Record<string, unknown>>;
}

export interface CypherState {
  queryResult: Record<string, CypherQueryResult>;
  activeRequests: string[];
  labels: CypherLabels;
}

export interface FrameProps {
  reqString: string;
  key: string;
  playTarget?: string;
}

export interface Frame {
  frameName: string;
  frameProps: FrameProps;
  isPinned: boolean;
  orgIndex?: number;
}

export type FrameState = Frame[];

export interface AlertProps {
  key: string;
  alertType: 'Notice' | 'Error';
  errorMessage: string;
}

export interface Alert {
  alertName: string;
  alertProps: AlertProps;
}

export type AlertState = Alert[];

export interface EditorState {
  command: string;
  updateClause: boolean;
  commandHistory: string[];
  commandFavorites: string[];
}

export interface SettingState {
  theme: string;
  maxNumOfFrames: number;
  maxNumOfHistories: number;
  maxDataOfGraph: number;
  maxDataOfTable: number;
  releaseDate: string;
  version: string;
  license: string;
}

export interface NavigatorState {
  menuList: [string, string][];
  activeMenu: string;
  isActive: boolean;
}

export interface ModalState {
  isOpen: boolean;
  isTutorial: boolean;
  graphHistory: unknown[];
  elementHistory: unknown[];
}

export interface LayoutState {
  isLabel: boolean;
}

// ─── Root State ───

export interface RootState {
  navigator: NavigatorState;
  setting: SettingState;
  database: DatabaseState;
  metadata: MetadataState;
  frames: FrameState;
  cypher: CypherState;
  alerts: AlertState;
  editor: EditorState;
  modal: ModalState;
  layout: LayoutState;
}
