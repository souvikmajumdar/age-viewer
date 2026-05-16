import { describe, it, expect, beforeEach } from 'vitest';
import GraphCreator from '../src/models/GraphCreator.js';

describe('GraphCreator', () => {
  let creator;

  beforeEach(() => {
    creator = new GraphCreator({
      nodes: [],
      edges: [],
      graphName: 'mygraph',
      dropGraph: false,
    });
  });

  describe('constructor', () => {
    it('initializes with empty query structure', () => {
      expect(creator.query).toEqual({
        graph: { drop: null, create: null },
        labels: [],
        nodes: [],
        edges: [],
      });
    });

    it('sets graph name', () => {
      expect(creator.graphName).toBe('mygraph');
    });

    it('handles default empty constructor', () => {
      const c = new GraphCreator();
      expect(c.nodefiles).toBeUndefined();
      expect(c.edgefiles).toBeUndefined();
    });
  });

  describe('createGraph', () => {
    it('sets create query without drop by default', async () => {
      await creator.createGraph();
      expect(creator.query.graph.create).toContain("create_graph('mygraph')");
      expect(creator.query.graph.drop).toBeNull();
    });

    it('sets both drop and create when drop=true', async () => {
      await creator.createGraph(true);
      expect(creator.query.graph.drop).toContain("drop_graph('mygraph'");
      expect(creator.query.graph.create).toContain("create_graph('mygraph')");
    });
  });

  describe('createNodeLabel', () => {
    it('appends a vlabel creation query', async () => {
      await creator.createNodeLabel('Person');
      expect(creator.query.labels).toHaveLength(1);
      expect(creator.query.labels[0]).toContain("create_vlabel('mygraph', 'Person')");
    });

    it('accumulates multiple labels', async () => {
      await creator.createNodeLabel('Person');
      await creator.createNodeLabel('City');
      expect(creator.query.labels).toHaveLength(2);
    });
  });

  describe('createEdgeLabel', () => {
    it('appends an elabel creation query', async () => {
      await creator.createEdgeLabel('KNOWS');
      expect(creator.query.labels).toHaveLength(1);
      expect(creator.query.labels[0]).toContain("create_elabel('mygraph', 'KNOWS')");
    });
  });

  describe('createNode', () => {
    it('builds a CREATE node query', async () => {
      await creator.createNode({ name: 'Alice', age: 30 }, 'Person');
      expect(creator.query.nodes).toHaveLength(1);
      const nodeQuery = creator.query.nodes[0];
      expect(nodeQuery).toContain('CREATE');
      expect(nodeQuery).toContain('(:Person');
      expect(nodeQuery).toContain("name:'Alice'");
      expect(nodeQuery).toContain('age:30');
    });
  });

  describe('createEdge', () => {
    it('builds a MATCH-CREATE edge query', async () => {
      const edge = {
        start_vertex_type: 'Person',
        start_id: '1',
        end_vertex_type: 'City',
        end_id: '2',
        weight: 5,
      };
      await creator.createEdge(edge, 'LIVES_IN');
      expect(creator.query.edges).toHaveLength(1);
      const edgeQuery = creator.query.edges[0];
      expect(edgeQuery).toContain('MATCH');
      expect(edgeQuery).toContain("(a:Person {id:'1'})");
      expect(edgeQuery).toContain("(b:City {id:'2'})");
      expect(edgeQuery).toContain('[e:LIVES_IN');
      expect(edgeQuery).toContain('weight:5');
    });

    it('removes start_vertex_type, start_id, end_vertex_type, end_id from edge props', async () => {
      const edge = {
        start_vertex_type: 'A',
        start_id: '1',
        end_vertex_type: 'B',
        end_id: '2',
        prop1: 'value',
      };
      await creator.createEdge(edge, 'REL');
      // The edge object now only has prop1 left
      expect(edge).toEqual({ prop1: 'value' });
    });
  });
});
