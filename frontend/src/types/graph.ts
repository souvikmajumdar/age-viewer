/**
 * Graph visualization types for cytoscape and related components.
 */

/** Cytoscape layout options */
export type CytoscapeLayoutName =
  | 'random'
  | 'grid'
  | 'breadthFirst'
  | 'concentric'
  | 'cola'
  | 'cose'
  | 'coseBilkent'
  | 'dagre'
  | 'klay'
  | 'euler'
  | 'avsdf'
  | 'spread';

/** Cytoscape node data */
export interface CytoscapeNodeData {
  id: string;
  label: string;
  properties: Record<string, unknown>;
  backgroundColor?: string;
  fontColor?: string;
  size?: number;
  caption?: string;
}

/** Cytoscape edge data */
export interface CytoscapeEdgeData {
  id: string;
  label: string;
  source: string;
  target: string;
  properties: Record<string, unknown>;
  backgroundColor?: string;
  fontColor?: string;
  size?: number;
  caption?: string;
}

/** Cytoscape element (node or edge) */
export interface CytoscapeElement {
  data: CytoscapeNodeData | CytoscapeEdgeData;
  group: 'nodes' | 'edges';
}

/** Legend item for node/edge labels */
export interface LegendItem {
  label: string;
  color: string;
  count: number;
}

/** Color/size/caption selector state */
export interface StyleSelector {
  color: string;
  size: number;
  caption: string;
}

/** Edge thickness settings */
export interface EdgeThicknessConfig {
  edge: string;
  property: string;
  min: number | string;
  max: number | string;
}

/** Graph filter configuration */
export interface GraphFilter {
  keyword: string;
  property: string;
}

/** Footer data for graph frames */
export interface GraphFooterData {
  type: 'graph' | 'background' | 'labels';
  data: {
    nodeCount?: number;
    edgeCount?: number;
    type?: 'node' | 'edge';
    labels?: LegendItem[];
  };
}
