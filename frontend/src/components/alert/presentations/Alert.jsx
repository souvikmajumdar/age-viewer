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
import { InlineNotification } from '@carbon/react';

const SingleAlert = ({
  alertKey,
  alertName,
  errorMessage,
  setCommand,
  removeAlert,
}) => {
  const dispatch = useDispatch();

  const setAlertConnect = (e, command) => {
    e.preventDefault();
    dispatch(() => {
      setCommand(command);
    });
  };

  const clearAlert = () => {
    dispatch(() => {
      removeAlert(alertKey);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      clearAlert();
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  if (alertName === 'NoticeServerDisconnected') {
    return (
      <InlineNotification
        kind="warning"
        title="Database Disconnected"
        subtitle={(
          <p>
            Database is Disconnected. You may use
            {' '}
            <button type="button" className="badge badge-light" onClick={(e) => setAlertConnect(e, ':server connect')}>

              <PlayFilledAlt size={20} />
              :server connect
            </button>
            {' '}
            to
            establish connection. There&apos;s a graph waiting for you.
          </p>
        )}
        onClose={() => { clearAlert(); return false; }}
      />
    );
  }
  if (alertName === 'NoticeServerConnected') {
    return (
      <InlineNotification
        kind="success"
        title="Database Connected"
        subtitle={(
          <p>
            Successfully database is connected. You may use
            {' '}
            <a href="/#" className="badge badge-light" onClick={(e) => setAlertConnect(e, ':server status')}>
              <PlayFilledAlt size={20} />
              :server status
            </a>
            {' '}
            to
            confirm connected database information.
          </p>
        )}
        onClose={() => { clearAlert(); return false; }}
      />
    );
  }
  if (alertName === 'ErrorServerConnectFail') {
    return (
      <InlineNotification
        kind="error"
        title="Database Connection Failed"
        subtitle={(
          <>
            <p>
              Failed to connect to the database. Are you sure the database is running on the server?
            </p>
            {errorMessage}
          </>
        )}
        onClose={() => { clearAlert(); return false; }}
      />
    );
  }
  if (alertName === 'ErrorNoDatabaseConnected') {
    return (
      <InlineNotification
        kind="error"
        title="No Database Connected"
        subtitle={(
          <>
            <p>
              You haven&apos;t set database connection. You may use
              {' '}
              <a href="/#" className="badge badge-light" onClick={(e) => setAlertConnect(e, ':server connect')}>
                <PlayFilledAlt size={20} />
                :server connect
              </a>
              {' '}
              to
              establish connection. There&apos;s a graph waiting for you.
            </p>
            {errorMessage}
          </>
        )}
        onClose={() => { clearAlert(); return false; }}
      />
    );
  }
  if (alertName === 'ErrorMetaFail') {
    return (
      <InlineNotification
        kind="error"
        title="Metadata Load Error"
        subtitle={(
          <p>
            Unexpectedly error occurred while getting metadata.
          </p>
        )}
        onClose={() => { clearAlert(); return false; }}
      />
    );
  }
  if (alertName === 'ErrorCypherQuery') {
    return (
      <InlineNotification
        kind="error"
        title="Query Error"
        subtitle={(
          <p>
            Your query was not executed properly. Refer the below error message.
          </p>
        )}
        onClose={() => { clearAlert(); return false; }}
      />
    );
  }
  if (alertName === 'ErrorPlayLoadFail') {
    return (
      <InlineNotification
        kind="error"
        title="Failed to Load Play Target"
        subtitle={(
          <p>
            &apos;
            {errorMessage}
            &apos; does not exists.
          </p>
        )}
        onClose={() => { clearAlert(); return false; }}
      />
    );
  }
  if (alertName === 'NoticeAlreadyConnected') {
    return (
      <InlineNotification
        kind="info"
        title="Already Connected to Database"
        subtitle={(
          <p>
            You are currently connected to a database.
            If you want to access to another database, you may execute
            <a
              href="/#"
              className="badge badge-light"
              onClick={(e) => setAlertConnect(e, ':server disconnect')}
            >
              <PlayFilledAlt size={20} />
              :server disconnect
            </a>
            {' '}
            to disconnect from current database first.
          </p>
        )}
        onClose={() => { clearAlert(); return false; }}
      />
    );
  }
  if (alertName === 'CreateGraphSuccess') {
    return (
      <InlineNotification
        kind="success"
        title="Graph Created"
        subtitle="Successfully created new graph"
        onClose={() => { clearAlert(); return false; }}
      />
    );
  }
  return (<></>);
};

export default SingleAlert;
