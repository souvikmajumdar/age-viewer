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

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PlayFilledAlt } from '@carbon/icons-react';
import { Grid, Column, Row } from '@carbon/react';
import Frame from '../Frame';

const ServerDisconnectFrame = ({
  refKey,
  isPinned,
  reqString,
  disconnectToDatabase,
  addFrame,
  addAlert,
  setCommand,
  resetMetaData,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(() => disconnectToDatabase().then((response) => {
      if (response.type === 'database/disconnectToDatabase/fulfilled') {
        resetMetaData();
      }
    }));
    /* dispatch(() => addFrame(':server connect')); */
    /* dispatch(() => addAlert('NoticeServerDisconnected')); */
  }, [dispatch, disconnectToDatabase, addFrame, addAlert]);

  return (
    <Frame
      reqString={reqString}
      isPinned={isPinned}
      refKey={refKey}
    >
      <Grid>
        <Row>
          <Column lg={4}>
            <h3>Disconnected Succesfully</h3>
            <p>You are successfully disconnected from Database.</p>
          </Column>
          <Column lg={12}>
            <p>
              You may run
              <a href="/#" className="badge badge-light" onClick={() => { setCommand(':server connect'); }}>
                <PlayFilledAlt size={20} />
                :server connection
              </a>
              {' '}
              to establish new connection
            </p>
          </Column>
        </Row>
      </Grid>
    </Frame>
  );
};

export default ServerDisconnectFrame;
