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
import { InlineNotification } from '@carbon/react';

const SingleAlert = ({
  alertKey,
  alertName,
  errorMessage,
  removeAlert,
}) => {
  const dispatch = useDispatch();

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
        subtitle="Database is Disconnected. Use ':server connect' to establish connection. There's a graph waiting for you."
        onClose={() => { clearAlert(); return false; }}
      />
    );
  }
  if (alertName === 'NoticeServerConnected') {
    return (
      <InlineNotification
        kind="success"
        title="Database Connected"
        subtitle="Successfully connected to the database. Use ':server status' to confirm connected database information."
        onClose={() => { clearAlert(); return false; }}
      />
    );
  }
  if (alertName === 'ErrorServerConnectFail') {
    return (
      <InlineNotification
        kind="error"
        title="Database Connection Failed"
        subtitle={`Failed to connect to the database. Are you sure the database is running on the server? ${errorMessage || ''}`}
        onClose={() => { clearAlert(); return false; }}
      />
    );
  }
  if (alertName === 'ErrorNoDatabaseConnected') {
    return (
      <InlineNotification
        kind="error"
        title="No Database Connected"
        subtitle={`You haven't set a database connection. Use ':server connect' to establish connection. There's a graph waiting for you. ${errorMessage || ''}`}
        onClose={() => { clearAlert(); return false; }}
      />
    );
  }
  if (alertName === 'ErrorMetaFail') {
    return (
      <InlineNotification
        kind="error"
        title="Metadata Load Error"
        subtitle="An unexpected error occurred while getting metadata."
        onClose={() => { clearAlert(); return false; }}
      />
    );
  }
  if (alertName === 'ErrorCypherQuery') {
    return (
      <InlineNotification
        kind="error"
        title="Query Error"
        subtitle="Your query was not executed properly. Refer to the error message below."
        onClose={() => { clearAlert(); return false; }}
      />
    );
  }
  if (alertName === 'ErrorPlayLoadFail') {
    return (
      <InlineNotification
        kind="error"
        title="Failed to Load Play Target"
        subtitle={`'${errorMessage}' does not exist.`}
        onClose={() => { clearAlert(); return false; }}
      />
    );
  }
  if (alertName === 'NoticeAlreadyConnected') {
    return (
      <InlineNotification
        kind="info"
        title="Already Connected to Database"
        subtitle="You are currently connected to a database. If you want to access another database, execute ':server disconnect' to disconnect from the current database first."
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
