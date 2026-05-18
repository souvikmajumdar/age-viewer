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
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sqlBasePath = join(__dirname, '../../sql');

// Supported PostgreSQL major versions
const SUPPORTED_VERSIONS = ['14', '15', '16', '17', '18'];
const MIN_SUPPORTED_VERSION = 14;
const MAX_SUPPORTED_VERSION = 18;

function getQuery(name, version = '') {
  if (version && !SUPPORTED_VERSIONS.includes(version)) {
    const versionNum = parseInt(version, 10);
    if (versionNum < MIN_SUPPORTED_VERSION) {
      throw new Error(
        `PostgreSQL ${version} is no longer supported. Minimum supported version is ${MIN_SUPPORTED_VERSION}. ` +
        `Please upgrade your PostgreSQL installation.`
      );
    }
    if (versionNum > MAX_SUPPORTED_VERSION) {
      throw new Error(
        `PostgreSQL ${version} is not yet supported. Maximum supported version is ${MAX_SUPPORTED_VERSION}. ` +
        `Supported versions: ${SUPPORTED_VERSIONS.join(', ')}.`
      );
    }
  }

  const sqlPath = join(sqlBasePath, version, `${name}.sql`);
  if (!fs.existsSync(sqlPath)) {
    throw new Error(
      `SQL file not found: ${name}.sql (version: ${version || 'default'}). ` +
      `Supported PostgreSQL versions: ${SUPPORTED_VERSIONS.join(', ')}.`
    );
  }
  return fs.readFileSync(sqlPath, 'utf8');
}

export { getQuery, SUPPORTED_VERSIONS, MIN_SUPPORTED_VERSION, MAX_SUPPORTED_VERSION };
