/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import PgConfig from '../config/Pg.js';
import pg from 'pg';
import types from 'pg-types';
import { setAGETypes, onConnectQueries } from '../tools/AGEParser.js';
import { getQuery } from '../tools/SQLFlavorManager.js';
import type { ConnectionInfo, PoolConnectionConfig } from '../types/database.js';

interface GraphRepositoryOptions {
  host?: string;
  port?: number;
  database?: string;
  graph?: string;
  user?: string;
  password?: string;
  graphs?: string[];
  server?: string;
}

type TransactionFn = (query: string, params?: unknown[]) => Promise<[pg.QueryResult, pg.PoolClient]>;

class GraphRepository {
  private _host: string | undefined;
  private _port: number | undefined;
  private _database: string | undefined;
  private _server_version: string | undefined;
  private _graphs: string[];
  private _graph: string | undefined;
  private _user: string | undefined;
  private _password: string | undefined;
  private _pool: pg.Pool | undefined;

  constructor({
    host,
    port,
    database,
    graph,
    user,
    password,
    graphs = [],
    server,
  }: GraphRepositoryOptions = {}) {
    this._host = host;
    this._port = port;
    this._database = database;
    this._server_version = server;
    this._graphs = graphs;
    this._graph = graph;
    this._user = user;
    this._password = password;
  }

  async connect(): Promise<pg.PoolClient> {
    if (!this._pool) {
      this._pool = GraphRepository.newConnectionPool(this.getPoolConnectionInfo());
    }
    const client = await this._pool.connect();
    if (!this._server_version) {
      const { server_version: v } = await onConnectQueries(client);
      this._server_version = v;
    }

    return client;
  }

  static newConnectionPool(poolConnectionConfig: PoolConnectionConfig | null): pg.Pool {
    return new pg.Pool(poolConnectionConfig as pg.PoolConfig);
  }

  // Execute cypher query with params
  async execute(query: string, params: unknown[] = []): Promise<pg.QueryResult> {
    const client = await this.getConnection();
    let result: pg.QueryResult;
    try {
      result = await client.query(query, params);
    } finally {
      client.release();
    }
    return result;
  }

  async createTransaction(): Promise<[pg.PoolClient, TransactionFn]> {
    const client = await this.getConnection();
    return [
      client,
      async (query: string, params: unknown[] = []): Promise<[pg.QueryResult, pg.PoolClient]> => {
        return [await client.query(query, params), client];
      },
    ];
  }

  async initGraphNames(): Promise<void> {
    const { rows } = await this.execute(getQuery('get_graph_names'));
    this._graphs = rows.map((item: Record<string, unknown>) => item.name as string);
    // set current graph to first name
    this.setCurrentGraph(this._graphs[0]);
  }

  /**
   * Get connectionInfo
   */
  async getConnection(): Promise<pg.PoolClient> {
    const client = await this._pool!.connect();
    await setAGETypes(client, types);
    return client;
  }

  /**
   * Release connection
   */
  async releaseConnection(): Promise<boolean> {
    try {
      await this._pool!.end();
      return true;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Get connection pool information
   */
  getPoolConnectionInfo(): PoolConnectionConfig | null {
    if (!this._host || !this._port || !this._database) {
      return null;
    }
    return {
      host: this._host,
      port: this._port,
      database: this._database,
      version: this._server_version,
      user: this._user!,
      password: this._password!,
      max: PgConfig.max,
      idleTimeoutMillis: PgConfig.idleTimeoutMillis,
      connectionTimeoutMillis: PgConfig.connectionTimeoutMillis,
    };
  }

  /**
   * Get connection info
   */
  getConnectionInfo(): ConnectionInfo {
    if (!this._host || !this._port || !this._database) {
      throw new Error('Not connected');
    }
    return {
      host: this._host,
      version: this._server_version || '',
      port: this._port,
      database: this._database,
      user: this._user!,
      password: this._password!,
      graphs: this._graphs,
      graph: this._graph || '',
    };
  }

  setCurrentGraph(name: string): void {
    this._graph = name;
  }
}

export default GraphRepository;
