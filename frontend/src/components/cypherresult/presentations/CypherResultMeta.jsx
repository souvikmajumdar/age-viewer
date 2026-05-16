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

import React from 'react';
import { Grid, Column, Row } from '@carbon/react';

const CypherResultMeta = ({ database, query, data }) => (
  <>
    <Grid>
      <Row>
        <Column lg={4}>
          <b>Server Version</b>
        </Column>
        <Column lg={12}>TBD</Column>
      </Row>
      <Row>
        <Column lg={4}><b>Database URI</b></Column>
        <Column lg={12}>
          {database.host}
          :
          {database.port}
        </Column>
      </Row>
      <Row>
        <Column lg={4}><b>Executed Query</b></Column>
        <Column lg={12}>{query}</Column>
      </Row>
      <Row>
        <Column lg={4}><b>Data</b></Column>
        <Column lg={12}><pre>{JSON.stringify(data, null, 2)}</pre></Column>
      </Row>
    </Grid>
  </>
);

export default CypherResultMeta;
