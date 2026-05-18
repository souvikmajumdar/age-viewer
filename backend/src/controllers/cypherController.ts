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

import type { Request, Response, NextFunction } from 'express';
import CypherService from "../services/cypherService.js";
import sessionService from "../services/sessionService.js";
import GraphCreator from "../models/GraphCreator.js";

class CypherController {
    async executeCypher(req: Request, res: Response): Promise<void> {
        const connectorService = sessionService.get(req.sessionID);
        if (connectorService && connectorService.isConnected()) {
            const cypherService = new CypherService(
                connectorService.graphRepository!
            );
            const data = await cypherService.executeCypher(req.body.cmd);
            res.status(200).json(data).end();
        } else {
            throw new Error("Not connected");
        }
    }

    async createGraph(req: Request, res: Response, next: NextFunction): Promise<void> {
        const db = sessionService.get(req.sessionID);
        if (db && db.isConnected()) {
            const [client, transaction] = await db.graphRepository!.createTransaction();
            try {
                const files = req.files as { [fieldname: string]: Express.Multer.File[] };
                const graph = new GraphCreator({
                    nodes: files.nodes,
                    edges: files.edges,
                    graphName: req.body.graphName,
                    dropGraph: req.body.dropGraph === 'true'
                });

                await graph.parseData();
                const DROP = graph.query.graph.drop;
                const CREATE = graph.query.graph.create;
                if (DROP) {
                    try {
                        await client.query(DROP);
                    } catch (e: unknown) {
                        if ((e as { code?: string }).code !== '3F000') throw e;
                    }
                }
                await client.query(CREATE!);
                await transaction('BEGIN');
                await Promise.all(graph.query.labels.map(async (q) => {
                    return await transaction(q);
                }));
                await Promise.all(graph.query.nodes.map(async (q) => {
                    return await transaction(q);
                }));
                await Promise.all(graph.query.edges.map(async (q) => {
                    return await transaction(q);
                }));
                await transaction('COMMIT');
                res.status(204).end();
            } catch (e: unknown) {
                await transaction('ROLLBACK');
                const details = String(e);
                const err = {
                    ...(e as object),
                    details
                };
                res.status(500).json(err).end();
            } finally {
                client.release();
            }
        }
    }
}

export default CypherController;
