import Papa from 'papaparse';
import { getDelete, toAgeProps } from '../util/ObjectExtras.js';
import QueryBuilder from './QueryBuilder.js';
import type { GraphCreationQueries } from '../types/age.js';

interface FileInput {
  originalname: string;
  buffer: Buffer;
}

interface ParsedData {
  type: string;
  data: Record<string, unknown>[];
}

interface GraphCreatorOptions {
  nodes?: FileInput[];
  edges?: FileInput[];
  graphName?: string;
  dropGraph?: boolean;
}

class GraphCreator {
  public nodefiles: FileInput[] | undefined;
  public edgefiles: FileInput[] | undefined;
  private dropGraph: boolean;
  private graphName: string;
  private nodes: ParsedData[];
  private edges: ParsedData[];
  public query: GraphCreationQueries;

  constructor({ nodes, edges, graphName, dropGraph }: GraphCreatorOptions = {}) {
    this.nodefiles = nodes as FileInput[];
    this.edgefiles = edges as FileInput[];
    this.dropGraph = dropGraph || false;
    this.graphName = graphName || '';
    this.nodes = [];
    this.edges = [];
    this.query = {
      graph: {
        drop: null,
        create: null,
      },
      labels: [],
      nodes: [],
      edges: [],
    };
  }

  async createNodeLabel(label: string): Promise<void> {
    const makeLabel = `SELECT create_vlabel('${this.graphName}', '${label}');`;
    this.query.labels.push(makeLabel);
  }

  async createEdgeLabel(label: string): Promise<void> {
    const makeLabel = `SELECT create_elabel('${this.graphName}', '${label}');`;
    this.query.labels.push(makeLabel);
  }

  async createNode(
    node: Record<string, unknown>,
    type: string,
    qbuild: QueryBuilder = new QueryBuilder({
      graphName: this.graphName,
      returnAs: 'v',
    }),
  ): Promise<void> {
    const CREATENODE = `(:${type} ${toAgeProps(node)})`;

    if (qbuild.clause === '') {
      qbuild.create();
    }

    qbuild.insertQuery(CREATENODE);
    this.query.nodes.push(qbuild.getGeneratedQuery());
  }

  async createEdge(
    edge: Record<string, unknown>,
    type: string,
    qbuild: QueryBuilder = new QueryBuilder({
      graphName: this.graphName,
      returnAs: 'e',
    }),
  ): Promise<void> {
    const startv = getDelete(edge, 'start_vertex_type');
    const startid = getDelete(edge, 'start_id');
    const endv = getDelete(edge, 'end_vertex_type');
    const endid = getDelete(edge, 'end_id');
    const eprops = edge;
    const CREATEEDGE = `MATCH
            (a:${startv} {id:'${startid}'}),
            (b:${endv} {id:'${endid}'})
            CREATE (a)-[e:${type} ${toAgeProps(eprops)}]->(b)`;

    qbuild.insertQuery(CREATEEDGE);

    this.query.edges.push(qbuild.getGeneratedQuery());
  }

  async createGraph(drop: boolean = false): Promise<void> {
    if (drop) {
      const dropgraph = `SELECT * FROM drop_graph('${this.graphName}', true);`;
      this.query.graph.drop = dropgraph;
    }
    const creategraph = `SELECT * FROM create_graph('${this.graphName}');`;
    this.query.graph.create = creategraph;
  }

  async readData(
    file: string,
    type: string,
    resolve: (value: ParsedData) => void,
  ): Promise<void> {
    Papa.parse(file, {
      complete: (res) => {
        res.errors.forEach((e) => {
          if (e.type === 'FieldMismatch') {
            res.data.splice(e.row, 1);
          }
        });
        const o: ParsedData = {
          type,
          data: res.data as Record<string, unknown>[],
        };
        resolve(o);
      },
      header: true,
    });
  }

  async parseData(): Promise<GraphCreationQueries> {
    this.createGraph(this.dropGraph);

    this.nodes = await Promise.all(
      (this.nodefiles || []).map(
        (node) =>
          new Promise<ParsedData>((resolve) => {
            this.createNodeLabel(node.originalname);
            this.readData(node.buffer.toString('utf8'), node.originalname, resolve);
          }),
      ),
    );
    this.nodes.forEach((nodeFile) => {
      nodeFile.data.forEach((n) => {
        this.createNode(n, nodeFile.type);
      });
    });
    this.edges = await Promise.all(
      (this.edgefiles || []).map(
        (edge) =>
          new Promise<ParsedData>((resolve) => {
            this.createEdgeLabel(edge.originalname);
            this.readData(edge.buffer.toString('utf8'), edge.originalname, resolve);
          }),
      ),
    );

    this.edges.forEach((edgeFile) => {
      edgeFile.data.forEach((e) => {
        this.createEdge(e, edgeFile.type);
      });
    });
    return this.query;
  }
}

export default GraphCreator;
