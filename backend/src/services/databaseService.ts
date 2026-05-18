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

import { getQuery } from '../tools/SQLFlavorManager.js';
import * as util from 'node:util';
import GraphRepository from '../models/GraphRepository.js';
import type {
    ConnectionInfo,
    GraphLabel,
    MetadataResponse,
    DatabaseRole,
    PropertyKey,
} from '../types/database.js';
import type { AgeEdge, ConvertedEdge } from '../types/age.js';

interface GraphNameParam {
    currentGraph: string;
}

interface ParsedMeta {
    nodes: GraphLabel[];
    edges: GraphLabel[];
}

interface ConnectionParams {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
}

class DatabaseService {
    _graphRepository: GraphRepository | null;

    constructor() {
        this._graphRepository = null;
    }

    async getMetaData(graphName?: GraphNameParam): Promise<MetadataResponse> {
        const gr = this._graphRepository!;
        await gr.initGraphNames();
        const { graphs } = gr.getConnectionInfo();
        await DatabaseService.analyzeGraph(gr);
        if (graphName) {
            if (graphs.includes(graphName.currentGraph)) {
                return await this.getMetaDataSingle(graphName.currentGraph, graphs);
            } else {
                return await this.getMetaDataSingle(gr['_graph'] as string, graphs);
            }
        } else if (graphs.length > 0) {
            return await this.graphNameInitialize(graphs);
        } else {
            throw new Error('graph does not exist');
        }
    }

    async getMetaDataSingle(curGraph: string, graphs: string[]): Promise<MetadataResponse> {
        const metadata: MetadataResponse = {};
        const { database } = this.getConnectionInfo();
        const { nodes, edges } = await this.readMetaData(curGraph);
        const propertyKeys = await this.getPropertyKeys();
        const role = await this.getRole();

        const data = {
            nodes,
            edges,
            propertyKeys,
            graph: curGraph,
            database,
            role,
        };

        graphs.forEach((gname) => {
            if (gname !== curGraph) metadata[gname] = {};
            else metadata[gname] = data;
        });

        return metadata;
    }

    async graphNameInitialize(graphs: string[]): Promise<MetadataResponse> {
        const metadata: MetadataResponse = {};
        graphs.forEach((gname) => {
            metadata[gname] = {};
        });
        return metadata;
    }

    async getGraphLabels(): Promise<GraphLabel[]> {
        const graphRepository = this._graphRepository!;
        const queryResult = await graphRepository.execute(
            getQuery('graph_labels'),
            [this.getConnectionInfo().graph],
        );
        return queryResult.rows as unknown as GraphLabel[];
    }

    async getGraphLabelCount(labelName: string, labelKind: string): Promise<Record<string, unknown>[]> {
        const graphRepository = this._graphRepository!;
        let query: string | null = null;

        if (labelKind === 'v') {
            query = util.format(getQuery('label_count_vertex'), `${this.getConnectionInfo().graph}.${labelName}`);
        } else if (labelKind === 'e') {
            query = util.format(getQuery('label_count_edge'), `${this.getConnectionInfo().graph}.${labelName}`);
        }

        const queryResult = await graphRepository.execute(query!);
        return queryResult.rows as Record<string, unknown>[];
    }

    static async analyzeGraph(gr: GraphRepository): Promise<void> {
        await gr.execute(getQuery('analyze_graph'));
    }

    async readMetaData(graphName: string): Promise<ParsedMeta> {
        const gr = this._graphRepository!;
        const { version } = gr.getConnectionInfo();
        const queryResult = await gr.execute(
            util.format(getQuery('meta_data', version.split('.')[0]), graphName),
        );
        return this.parseMeta(queryResult.rows as unknown as GraphLabel[]);
    }

    async getPropertyKeys(): Promise<PropertyKey[]> {
        const graphRepository = this._graphRepository!;
        const queryResult = await graphRepository.execute(getQuery('property_keys'));
        return queryResult.rows as unknown as PropertyKey[];
    }

    async getRole(): Promise<DatabaseRole> {
        const graphRepository = this._graphRepository!;
        const queryResult = await graphRepository.execute(
            getQuery('get_role'),
            [this.getConnectionInfo().user],
        );
        return queryResult.rows[0] as unknown as DatabaseRole;
    }

    async connectDatabase(connectionInfo: ConnectionParams): Promise<boolean> {
        let graphRepository = this._graphRepository;
        if (graphRepository == null) {
            this._graphRepository = new GraphRepository(connectionInfo);
            graphRepository = this._graphRepository;
        }

        try {
            const client = await graphRepository.connect();
            client.release();
        } catch (e) {
            this._graphRepository = null;
            throw e;
        }
        return true;
    }

    async disconnectDatabase(): Promise<boolean> {
        const graphRepository = this._graphRepository;
        if (graphRepository == null) {
            console.log('Already Disconnected');
            return false;
        } else {
            const isRelease = await this._graphRepository!.releaseConnection();
            if (isRelease) {
                this._graphRepository = null;
                return true;
            } else {
                console.log('Failed releaseConnection()');
                return false;
            }
        }
    }

    async getConnectionStatus(): Promise<boolean> {
        const graphRepository = this._graphRepository;
        if (graphRepository == null) {
            return false;
        }

        try {
            const client = await graphRepository.getConnection();
            client.release();
        } catch (err) {
            return false;
        }
        return true;
    }

    getConnectionInfo(): ConnectionInfo {
        if (this.isConnected() === false)
            throw new Error('Not connected');
        return this._graphRepository!.getConnectionInfo();
    }

    isConnected(): boolean {
        return this._graphRepository != null;
    }

    get graphRepository(): GraphRepository | null {
        return this._graphRepository;
    }

    convertEdge({ label, id, start, end, props }: AgeEdge): ConvertedEdge {
        return {
            label: label,
            id: `${id.oid}.${id.id}`,
            start: `${start.oid}.${start.id}`,
            end: `${end.oid}.${end.id}`,
            properties: props,
        };
    }

    parseMeta(data: GraphLabel[]): ParsedMeta {
        const meta: ParsedMeta = {
            edges: [],
            nodes: [],
        };
        const vertex_name = '_ag_label_vertex';
        const edge_name = '_ag_label_edge';

        data.forEach((element) => {
            if (element.name === vertex_name || element.name === edge_name) {
                return;
            }

            if (element.kind === 'v') meta.nodes.push(element);
            if (element.kind === 'e') meta.edges.push(element);
        });
        return meta;
    }
}

export default DatabaseService;
