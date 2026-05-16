import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

const agent = request.agent(app);
const API = '/api/v1';

describe('API Integration Tests', () => {
  describe('Session Middleware', () => {
    it('creates a session on first request', async () => {
      const res = await agent.get(`${API}/db`);
      // Should get a set-cookie header with session
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('maintains session across requests', async () => {
      const res1 = await agent.get(`${API}/db`);
      const res2 = await agent.get(`${API}/db`);
      // Both should return consistent state (not connected)
      expect(res1.status).toBe(res2.status);
    });
  });

  describe('GET /api/v1/db (connection status)', () => {
    it('returns 500 when not connected', async () => {
      const res = await agent.get(`${API}/db`);
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('Not connected');
    });
  });

  describe('GET /api/v1/db/disconnect', () => {
    it('returns 500 when not connected', async () => {
      const res = await agent.get(`${API}/db/disconnect`);
      expect(res.status).toBe(500);
      expect(res.body.message).toContain('Not connected');
    });
  });

  describe('POST /api/v1/db/connect', () => {
    it('returns 500 with invalid connection info (no database running)', async () => {
      const res = await agent
        .post(`${API}/db/connect`)
        .send({
          host: 'localhost',
          port: 59999, // non-existent port
          database: 'nonexistent',
          user: 'test',
          password: 'test',
        });
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message');
    });

    it('returns 500 when connection is refused', async () => {
      const res = await agent
        .post(`${API}/db/connect`)
        .send({
          host: '192.0.2.1', // non-routable address
          port: 5432,
          database: 'test',
          user: 'test',
          password: 'test',
        });
      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/v1/db/meta', () => {
    it('returns 500 when not connected', async () => {
      const res = await agent
        .post(`${API}/db/meta`)
        .send({});
      expect(res.status).toBe(500);
      expect(res.body.message).toContain('Not connected');
    });
  });

  describe('POST /api/v1/cypher', () => {
    it('returns 500 when not connected', async () => {
      const res = await agent
        .post(`${API}/cypher`)
        .send({ cmd: 'MATCH (n) RETURN n' });
      expect(res.status).toBe(500);
      expect(res.body.message).toContain('Not connected');
    });

    it('returns 500 with empty body when not connected', async () => {
      const res = await agent
        .post(`${API}/cypher`)
        .send({});
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/v1/miscellaneous', () => {
    it('returns keyword list with 200', async () => {
      const res = await agent.get(`${API}/miscellaneous`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('kw');
      expect(res.body).toHaveProperty('relationships');
      expect(Array.isArray(res.body.kw)).toBe(true);
      expect(Array.isArray(res.body.relationships)).toBe(true);
    });

    it('returns non-empty keyword data', async () => {
      const res = await agent.get(`${API}/miscellaneous`);
      expect(res.body.kw.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handler', () => {
    it('returns JSON error format with severity, message, code', async () => {
      const res = await agent.get(`${API}/db`);
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('severity');
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('code');
    });

    it('returns proper content-type', async () => {
      const res = await agent.get(`${API}/db`);
      expect(res.headers['content-type']).toContain('application/json');
    });
  });

  describe('CORS', () => {
    it('includes CORS headers in response', async () => {
      const res = await agent
        .get(`${API}/db`)
        .set('Origin', 'http://localhost:3000');
      expect(res.headers['access-control-allow-origin']).toBeDefined();
      expect(res.headers['access-control-allow-credentials']).toBe('true');
    });
  });

  describe('Session Isolation', () => {
    it('different agents have independent sessions', async () => {
      const agent1 = request.agent(app);
      const agent2 = request.agent(app);

      const res1 = await agent1.get(`${API}/db`);
      const res2 = await agent2.get(`${API}/db`);

      // Both should be "not connected" independently
      expect(res1.status).toBe(500);
      expect(res2.status).toBe(500);
      expect(res1.body.message).toBe(res2.body.message);
    });
  });
});
