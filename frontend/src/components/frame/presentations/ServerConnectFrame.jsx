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
import {
  Grid, Row, Column, TextInput, NumberInput, Button, PasswordInput,
} from '@carbon/react';
import { useDispatch } from 'react-redux';
import Frame from '../Frame';

import styles from './ServerConnectFrame.module.scss';
import { connectToDatabase as connectToDatabaseApi, changeGraph } from '../../../features/database/DatabaseSlice';
import { addAlert } from '../../../features/alert/AlertSlice';
import { addFrame, trimFrame } from '../../../features/frame/FrameSlice';
import { /* getMetaChartData, */ getMetaData } from '../../../features/database/MetadataSlice';

const ServerConnectFrame = ({
  refKey,
  isPinned,
  reqString,
  currentGraph,
}) => {
  const dispatch = useDispatch();

  const connectToDatabase = (data) => dispatch(connectToDatabaseApi(data)).then((response) => {
    if (response.type === 'database/connectToDatabase/fulfilled') {
      dispatch(addAlert('NoticeServerConnected'));
      dispatch(trimFrame('ServerConnect'));
      dispatch(getMetaData({ currentGraph })).then((metadataResponse) => {
        if (metadataResponse.type === 'database/getMetaData/fulfilled') {
          const graphName = Object.keys(metadataResponse.payload)[0];
          /* dispatch(getMetaChartData()); */
          dispatch(changeGraph({ graphName }));
        }
        if (metadataResponse.type === 'database/getMetaData/rejected') {
          dispatch(addAlert('ErrorMetaFail'));
        }
      });

      dispatch(addFrame(':server status', 'ServerStatus'));
    } else if (response.type === 'database/connectToDatabase/rejected') {
      dispatch(addAlert('ErrorServerConnectFail', response.error.message));
    }
  });

  return (
    <Frame
      reqString={reqString}
      isPinned={isPinned}
      refKey={refKey}
    >
      <Grid>
        <Row>
          <Column lg={4}>
            <h3>Connect to Database</h3>
            <p>Database access might require an authenticated connection.</p>
          </Column>
          <Column lg={12}>
            <div className={styles.FrameWrapper}>
              <form onSubmit={(e) => { e.preventDefault(); const formData = new FormData(e.target); connectToDatabase(Object.fromEntries(formData)); }}>
                <TextInput id="host" name="host" labelText="Connect URL" placeholder="192.168.0.1" required />
                <NumberInput id="port" name="port" label="Connect Port" placeholder="5432" min={1} max={65535} required className={styles.FullWidth} />
                <TextInput id="database" name="database" labelText="Database Name" placeholder="postgres" required />
                <TextInput id="user" name="user" labelText="User Name" placeholder="postgres" required />
                <PasswordInput id="password" name="password" labelText="Password" placeholder="postgres" required />
                <Button type="submit">Connect</Button>
              </form>
            </div>
          </Column>
        </Row>
      </Grid>
    </Frame>
  );
};

export default ServerConnectFrame;
