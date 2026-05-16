import { describe, it, expect, vi } from 'vitest';
import CypherService from '../src/services/cypherService.js';

describe('CypherService', () => {
  describe('executeCypher', () => {
    it('throws when query is empty', async () => {
      const service = new CypherService(null);
      await expect(service.executeCypher('')).rejects.toThrow('Query not entered!');
    });

    it('throws when query is null', async () => {
      const service = new CypherService(null);
      await expect(service.executeCypher(null)).rejects.toThrow('Query not entered!');
    });

    it('returns formatted result on success', async () => {
      const mockResultSet = {
        rows: [{ a: 1 }, { a: 2 }],
        fields: [{ name: 'a' }],
        rowCount: 2,
        command: 'SELECT',
      };
      const mockRepo = { execute: vi.fn().mockResolvedValue(mockResultSet) };
      const service = new CypherService(mockRepo);

      const result = await service.executeCypher('MATCH (n) RETURN n');
      expect(result).toEqual({
        rows: [{ a: 1 }, { a: 2 }],
        columns: ['a'],
        rowCount: 2,
        command: 'SELECT',
      });
      expect(mockRepo.execute).toHaveBeenCalledWith('MATCH (n) RETURN n');
    });

    it('propagates repository errors', async () => {
      const mockRepo = { execute: vi.fn().mockRejectedValue(new Error('connection lost')) };
      const service = new CypherService(mockRepo);
      await expect(service.executeCypher('MATCH (n) RETURN n')).rejects.toThrow('connection lost');
    });
  });

  describe('createResult', () => {
    it('handles single result set', () => {
      const service = new CypherService(null);
      const resultSet = {
        rows: [{ a: 1 }],
        fields: [{ name: 'a' }, { name: 'b' }],
        rowCount: 1,
        command: 'SELECT',
      };
      const result = service.createResult(resultSet);
      expect(result.columns).toEqual(['a', 'b']);
      expect(result.rowCount).toBe(1);
      expect(result.command).toBe('SELECT');
    });

    it('uses last item from array result set', () => {
      const service = new CypherService(null);
      const resultSet = [
        { rows: [], fields: [], rowCount: 0, command: 'BEGIN' },
        { rows: [{ x: 1 }], fields: [{ name: 'x' }], rowCount: 1, command: 'SELECT' },
      ];
      const result = service.createResult(resultSet);
      expect(result.command).toBe('SELECT');
      expect(result.rowCount).toBe(1);
    });
  });

  describe('convertVertex', () => {
    it('formats vertex with composed id', () => {
      const service = new CypherService(null);
      const vertex = {
        label: 'Person',
        id: { oid: 100, id: 5 },
        props: { name: 'Alice' },
      };
      expect(service.convertVertex(vertex)).toEqual({
        label: 'Person',
        id: '100.5',
        properties: { name: 'Alice' },
      });
    });
  });

  describe('convertEdge', () => {
    it('formats edge with composed ids', () => {
      const service = new CypherService(null);
      const edge = {
        label: 'KNOWS',
        id: { oid: 200, id: 1 },
        start: { oid: 100, id: 1 },
        end: { oid: 100, id: 2 },
        props: { since: 2020 },
      };
      expect(service.convertEdge(edge)).toEqual({
        label: 'KNOWS',
        id: '200.1',
        start: '100.1',
        end: '100.2',
        properties: { since: 2020 },
      });
    });
  });

  describe('convertPath', () => {
    it('flattens vertices and edges into an array', () => {
      const service = new CypherService(null);
      const path = {
        vertices: [
          { label: 'A', id: { oid: 1, id: 1 }, props: {} },
          { label: 'B', id: { oid: 1, id: 2 }, props: {} },
        ],
        edges: [
          {
            label: 'R',
            id: { oid: 2, id: 1 },
            start: { oid: 1, id: 1 },
            end: { oid: 1, id: 2 },
            props: {},
          },
        ],
      };
      const result = service.convertPath(path);
      expect(result).toHaveLength(3);
      expect(result[0]).toMatchObject({ label: 'A', id: '1.1' });
      expect(result[1]).toMatchObject({ label: 'B', id: '1.2' });
      expect(result[2]).toMatchObject({ label: 'R', id: '2.1' });
    });

    it('handles empty path', () => {
      const service = new CypherService(null);
      expect(service.convertPath({ vertices: [], edges: [] })).toEqual([]);
    });
  });
});
