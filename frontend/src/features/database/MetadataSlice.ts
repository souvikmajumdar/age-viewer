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
import type { MetadataResponse } from '../../types/api';
import type { MetadataState } from '../../types/redux';

interface MetadataArg {
  graph?: string;
  database?: string;
}

export const getMetaData = createAsyncThunk<MetadataResponse, MetadataArg>(
  'database/getMetaData',
  async (arg) => {
    try {
      const response = await fetch('/api/v1/db/meta',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(arg),
        });
      if (response.ok) {
        const ret: MetadataResponse = await response.json();
        Object.keys(ret).forEach((gname) => {
          let allCountEdge = 0;
          let allCountNode = 0;
          ret[gname].nodes?.forEach((item) => {
            allCountNode += item.cnt;
          });

          ret[gname].edges?.forEach((item) => {
            allCountEdge += item.cnt;
          });
          ret[gname].nodes?.unshift({ label: '*', cnt: allCountNode } as typeof ret[string]['nodes'][0]);
          ret[gname].edges?.unshift({ label: '*', cnt: allCountEdge } as typeof ret[string]['edges'][0]);
          ret[gname].id = crypto.randomUUID();
        });
        return ret;
      }
      throw response;
    } catch (error) {
      const err = error as { severity?: string; code?: string; message?: string; statusText?: string };
      const errorDetail = {
        name: 'Database Connection Failed',
        message: `[${err.severity}]:(${err.code}) ${err.message} `,
        statusText: err.statusText,
      };
      throw errorDetail;
    }
  },
);

const MetadataSlice = createSlice({
  name: 'metadata',
  initialState: {
    graphs: {},
    status: 'init',
    dbname: '',
    currentGraph: '',
  } as MetadataState,
  reducers: {
    resetMetaData: (state) => (state as unknown as { initialState: MetadataState }).initialState,
    changeCurrentGraph: (state, action: PayloadAction<{ id?: string; name?: string }>) => ({
      ...state,
      currentGraph: Object.entries(state.graphs)
        .find(([k, data]) => data.id === action.payload.id || k === action.payload.name)![0],
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMetaData.fulfilled, (state, action) => {
        if (action.payload) {
          return {
            ...state,
            graphs: action.payload,
            status: 'connected' as const,
            dbname: (action.payload as MetadataResponse & { database?: string }).database ?? '',
            currentGraph: state.currentGraph !== '' ? state.currentGraph : Object.keys(action.payload)[0],
          };
        }
        return {
          ...state,
          status: 'disconnected' as const,
          dbname: (action.payload as MetadataResponse & { database?: string }).database ?? '',
        };
      });
  },
});

export const { resetMetaData, changeCurrentGraph } = MetadataSlice.actions;

export default MetadataSlice.reducer;
