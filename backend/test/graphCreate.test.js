import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import app from '../src/app.js';
import { queries } from './test-queries/queries.js';
import { connectionForm } from './testDB.js';
import request from 'supertest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const agent = request.agent(app);
request.Test.prototype.attachMultiple = function (files, key) {
  files.forEach(([name, path]) => {
    this.attach(key, path, name);
  });
  return this;
};

const START_PATH = '/api/v1';

describe('Graph Creation', () => {
  beforeAll(async () => {
    const res = await agent
      .post(`${START_PATH}/db/connect`)
      .send({ ...connectionForm });
    expect(res.status).toBe(200);
  });

  it('creates a graph', async () => {
    const urlPath = `${START_PATH}/cypher/init`;
    const nodesFilePath = [['Make', getPathForFile('make.csv')], ['Model', getPathForFile('model.csv')]];
    const edgesFilePath = [['has_model', getPathForFile('has_model.csv')]];

    const res = await agent
      .post(urlPath)
      .field('graphName', connectionForm.database)
      .field('dropGraph', 'true')
      .attachMultiple(nodesFilePath, 'nodes')
      .attachMultiple(edgesFilePath, 'edges');

    expect(res.status).toBe(204);
  });

  afterAll(async () => {
    const query = queries.drop_graph(connectionForm.database, true, (s) => ({ cmd: s }));
    await agent
      .post(`${START_PATH}/cypher`)
      .send(query)
      .expect(200);
  });
});

function getPathForFile(fname) {
  const dataPath = 'test-data';
  return join(__dirname, dataPath, fname);
}
