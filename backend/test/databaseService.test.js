import { describe, it, expect, vi } from 'vitest';
import DatabaseService from '../src/services/databaseService.js';

describe('DatabaseService', () => {
  describe('isConnected', () => {
    it('returns false when no graph repository', () => {
      const service = new DatabaseService();
      expect(service.isConnected()).toBe(false);
    });

    it('returns true when graph repository is set', () => {
      const service = new DatabaseService();
      service._graphRepository = {};
      expect(service.isConnected()).toBe(true);
    });
  });

  describe('getConnectionInfo', () => {
    it('throws when not connected', () => {
      const service = new DatabaseService();
      expect(() => service.getConnectionInfo()).toThrow('Not connected');
    });

    it('returns connection info from graph repository', () => {
      const service = new DatabaseService();
      const mockInfo = { host: 'localhost', port: 5432, database: 'test' };
      service._graphRepository = {
        getConnectionInfo: () => mockInfo,
      };
      expect(service.getConnectionInfo()).toEqual(mockInfo);
    });
  });

  describe('parseMeta', () => {
    it('separates nodes and edges by kind', () => {
      const service = new DatabaseService();
      const data = [
        { name: 'Person', kind: 'v', cnt: 5 },
        { name: 'KNOWS', kind: 'e', cnt: 3 },
        { name: 'City', kind: 'v', cnt: 2 },
      ];
      expect(service.parseMeta(data)).toEqual({
        nodes: [
          { name: 'Person', kind: 'v', cnt: 5 },
          { name: 'City', kind: 'v', cnt: 2 },
        ],
        edges: [
          { name: 'KNOWS', kind: 'e', cnt: 3 },
        ],
      });
    });

    it('filters out internal AGE labels', () => {
      const service = new DatabaseService();
      const data = [
        { name: '_ag_label_vertex', kind: 'v' },
        { name: '_ag_label_edge', kind: 'e' },
        { name: 'Person', kind: 'v' },
      ];
      const result = service.parseMeta(data);
      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].name).toBe('Person');
      expect(result.edges).toHaveLength(0);
    });

    it('returns empty arrays for empty input', () => {
      const service = new DatabaseService();
      expect(service.parseMeta([])).toEqual({ nodes: [], edges: [] });
    });
  });

  describe('graphNameInitialize', () => {
    it('returns metadata object with empty entries for each graph', async () => {
      const service = new DatabaseService();
      const result = await service.graphNameInitialize(['g1', 'g2', 'g3']);
      expect(result).toEqual({ g1: {}, g2: {}, g3: {} });
    });

    it('returns empty object for empty graphs array', async () => {
      const service = new DatabaseService();
      expect(await service.graphNameInitialize([])).toEqual({});
    });
  });

  describe('connectDatabase', () => {
    it('creates a graph repository on first connect', async () => {
      const service = new DatabaseService();
      const mockClient = { release: vi.fn() };
      const mockConnect = vi.fn().mockResolvedValue(mockClient);

      // Stub GraphRepository so we don't actually connect
      service._graphRepository = { connect: mockConnect };

      const result = await service.connectDatabase({ host: 'localhost' });
      expect(result).toBe(true);
      expect(mockConnect).toHaveBeenCalled();
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('clears graph repository on connection failure', async () => {
      const service = new DatabaseService();
      service._graphRepository = {
        connect: vi.fn().mockRejectedValue(new Error('connection failed')),
      };
      await expect(service.connectDatabase({})).rejects.toThrow('connection failed');
      expect(service._graphRepository).toBeNull();
    });
  });

  describe('disconnectDatabase', () => {
    it('returns false when already disconnected', async () => {
      const service = new DatabaseService();
      const result = await service.disconnectDatabase();
      expect(result).toBe(false);
    });

    it('releases connection and clears repository', async () => {
      const service = new DatabaseService();
      service._graphRepository = {
        releaseConnection: vi.fn().mockResolvedValue(true),
      };
      const result = await service.disconnectDatabase();
      expect(result).toBe(true);
      expect(service._graphRepository).toBeNull();
    });

    it('returns false when releaseConnection fails', async () => {
      const service = new DatabaseService();
      const repo = { releaseConnection: vi.fn().mockResolvedValue(false) };
      service._graphRepository = repo;
      const result = await service.disconnectDatabase();
      expect(result).toBe(false);
      // Repository should still be set since release didn't succeed
      expect(service._graphRepository).toBe(repo);
    });
  });

  describe('getConnectionStatus', () => {
    it('returns false when not connected', async () => {
      const service = new DatabaseService();
      expect(await service.getConnectionStatus()).toBe(false);
    });

    it('returns true when connection works', async () => {
      const service = new DatabaseService();
      const mockClient = { release: vi.fn() };
      service._graphRepository = {
        getConnection: vi.fn().mockResolvedValue(mockClient),
      };
      expect(await service.getConnectionStatus()).toBe(true);
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('returns false when getConnection throws', async () => {
      const service = new DatabaseService();
      service._graphRepository = {
        getConnection: vi.fn().mockRejectedValue(new Error('timeout')),
      };
      expect(await service.getConnectionStatus()).toBe(false);
    });
  });
});
