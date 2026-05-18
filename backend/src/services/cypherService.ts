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

import type GraphRepository from '../models/GraphRepository.js';
import type {
    AgeVertex,
    AgeEdge,
    AgePath,
    ConvertedVertex,
    ConvertedEdge,
    ConvertedPath,
    QueryResult,
} from '../types/age.js';

interface CypherResult {
    rows: Record<string, unknown>[];
    columns: string[];
    rowCount: number;
    command: string;
}

class CypherService {
    private _graphRepository: GraphRepository;

    constructor(graphRepository: GraphRepository) {
        this._graphRepository = graphRepository;
    }

    async executeCypher(query: string): Promise<CypherResult> {
        if (!query) {
            throw new Error('Query not entered!');
        }
        const resultSet = await this._graphRepository.execute(query);
        return this.createResult(resultSet);
    }

    createResult(resultSet: QueryResult | QueryResult[]): CypherResult {
        let targetItem: QueryResult;

        if (Array.isArray(resultSet)) {
            targetItem = resultSet.pop()!;
        } else {
            targetItem = resultSet;
        }

        const cypherRow = targetItem.rows;
        return {
            rows: cypherRow,
            columns: this._getColumns(targetItem),
            rowCount: this._getRowCount(targetItem),
            command: this._getCommand(targetItem),
        };
    }

    private _getColumns(resultSet: QueryResult): string[] {
        return resultSet.fields.map((field) => field.name);
    }

    private _getRowCount(resultSet: QueryResult): number {
        return resultSet.rowCount;
    }

    private _getCommand(resultSet: QueryResult): string {
        return resultSet.command;
    }

    _convertRowToResult(resultSet: QueryResult): Record<string, unknown>[] {
        return resultSet.rows.map((row) => {
            const convertedObject: Record<string, unknown> = {};
            for (const k in row) {
                if (row[k]) {
                    const value = row[k] as { constructor: { name: string } };
                    const typeName = value.constructor.name;
                    if (typeName === 'Path') {
                        convertedObject[k] = this.convertPath(row[k] as AgePath);
                    } else if (typeName === 'Vertex') {
                        convertedObject[k] = this.convertVertex(row[k] as AgeVertex);
                    } else if (typeName === 'Edge') {
                        convertedObject[k] = this.convertEdge(row[k] as AgeEdge);
                    } else {
                        convertedObject[k] = row[k];
                    }
                } else {
                    convertedObject[k] = null;
                }
            }
            return convertedObject;
        });
    }

    convertPath({ vertices, edges }: AgePath): ConvertedPath {
        const result: ConvertedPath = [];
        for (const idx in vertices) {
            result.push(this.convertVertex(vertices[idx]));
        }
        for (const idx in edges) {
            result.push(this.convertEdge(edges[idx]));
        }
        return result;
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

    convertVertex({ label, id, props }: AgeVertex): ConvertedVertex {
        return {
            label: label,
            id: `${id.oid}.${id.id}`,
            properties: props,
        };
    }
}

export default CypherService;
