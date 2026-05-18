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
import DatabaseService from '../services/databaseService.js';
import sessionService from '../services/sessionService.js';

function sessionRouter(req: Request, res: Response, next: NextFunction): void {
    if (sessionService.get(req.sessionID) == null) {
        sessionService.put(req.sessionID, new DatabaseService());
    }
    next();
}

export default sessionRouter;
