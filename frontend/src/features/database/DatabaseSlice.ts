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

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ConnectionInfo } from '../../types/api';
import type { DatabaseState } from '../../types/redux';

interface ConnectFormData {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  graph?: string;
}

interface ConnectionError {
  name: string;
  message: string;
  statusText: string;
}

export const connectToDatabase = createAsyncThunk<ConnectionInfo, ConnectFormData>(
  'database/connectToDatabase',
  async (formData) => {
    try {
      const response = await fetch('/api/v1/db/connect',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      if (response.ok) { return await response.json(); }
      throw response;
    } catch (error) {
      const errorJson = await (error as Response).json();
      const errorDetail: ConnectionError = {
        name: 'Failed to Retrieve Connection Information',
        message: `[${errorJson.severity}]:(${errorJson.code}) ${errorJson.message} `,
        statusText: (error as Response).statusText,
      };
      throw errorDetail;
    }
  },
);

export const disconnectToDatabase = createAsyncThunk<void, void>(
  'database/disconnectToDatabase',
  async () => {
    await fetch('/api/v1/db/disconnect');
  },
);

export const getConnectionStatus = createAsyncThunk<ConnectionInfo, void>(
  'database/getConnectionStatus',
  async () => {
    try {
      const response = await fetch('/api/v1/db');
      if (response.ok) { return await response.json(); }
      throw response;
    } catch (error) {
      const errorJson = await (error as Response).json();
      const errorDetail: ConnectionError = {
        name: 'Failed to Retrieve Connection Information',
        message: `[${errorJson.severity}]:(${errorJson.code}) ${errorJson.message} `,
        statusText: (error as Response).statusText,
      };
      throw errorDetail;
    }
  },
);

const disconnectedState: DatabaseState = {
  host: '',
  port: undefined,
  user: '',
  password: '',
  database: '',
  graph: '',
  status: 'disconnected',
};

const DatabaseSlice = createSlice({
  name: 'database',
  initialState: {
    status: 'init',
  } as DatabaseState,
  reducers: {
    changeGraph: (state, action: PayloadAction<{ graphName: string }>) => ({
      ...state,
      graph: action.payload.graphName,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectToDatabase.fulfilled, (state, action) => ({
        host: action.payload.host,
        port: action.payload.port,
        user: action.payload.user,
        password: action.payload.password,
        database: action.payload.database,
        graph: action.payload.graph,
        status: 'connected' as const,
      }))
      .addCase(connectToDatabase.rejected, () => disconnectedState)
      .addCase(disconnectToDatabase.fulfilled, () => disconnectedState)
      .addCase(getConnectionStatus.fulfilled, (state, action) => ({
        host: action.payload.host,
        port: action.payload.port,
        user: action.payload.user,
        password: action.payload.password,
        database: action.payload.database,
        graph: action.payload.graph,
        status: 'connected' as const,
      }))
      .addCase(getConnectionStatus.rejected, () => disconnectedState);
  },
});

export const { changeGraph } = DatabaseSlice.actions;

export default DatabaseSlice.reducer;
