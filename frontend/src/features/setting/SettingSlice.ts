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

/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { about, setting } from '../../conf/config';
import { saveToCookie } from '../cookie/CookieUtil';
import type { SettingState } from '../../types/redux';

const SidebarSettingSlice = createSlice({
  name: 'setting',
  initialState: {
    theme: setting.theme,
    maxNumOfFrames: setting.maxNumOfFrames,
    maxNumOfHistories: setting.maxNumOfHistories,
    maxDataOfGraph: setting.maxDataOfGraph,
    maxDataOfTable: setting.maxDataOfTable,
    releaseDate: about.releaseDate,
    version: about.version,
    license: about.license,
  } as SettingState,
  reducers: {
    resetSetting: (): SettingState => {
      saveToCookie('theme', setting.theme);
      saveToCookie('maxNumOfFrames', setting.maxNumOfFrames);
      saveToCookie('maxNumOfHistories', setting.maxNumOfHistories);
      saveToCookie('maxDataOfGraph', setting.maxDataOfGraph);
      saveToCookie('maxDataOfTable', setting.maxDataOfTable);
      saveToCookie('releaseDate', about.releaseDate);
      saveToCookie('version', about.version);
      saveToCookie('license', about.license);

      return {
        theme: setting.theme,
        maxNumOfFrames: setting.maxNumOfFrames,
        maxNumOfHistories: setting.maxNumOfHistories,
        maxDataOfGraph: setting.maxDataOfGraph,
        maxDataOfTable: setting.maxDataOfTable,
        releaseDate: about.releaseDate,
        version: about.version,
        license: about.license,
      };
    },
    changeTheme: {
      reducer: (state, action: PayloadAction<{ theme: string }>) => {
        state.theme = action.payload.theme;
      },
      prepare: (event: React.ChangeEvent<HTMLSelectElement>) => ({ payload: { theme: event.target.value } }),
    },
    changeMaxNumOfFrames: {
      reducer: (state, action: PayloadAction<{ maxNumOfFrames: number }>) => {
        state.maxNumOfFrames = action.payload.maxNumOfFrames;
      },
      prepare: (event: number) => ({ payload: { maxNumOfFrames: event } }),
    },
    changeMaxNumOfHistories: {
      reducer: (state, action: PayloadAction<{ maxNumOfHistories: number }>) => {
        state.maxNumOfHistories = action.payload.maxNumOfHistories;
      },
      prepare: (event: number) => ({ payload: { maxNumOfHistories: event } }),
    },
    changeMaxDataOfGraph: {
      reducer: (state, action: PayloadAction<{ maxDataOfGraph: number }>) => {
        state.maxDataOfGraph = action.payload.maxDataOfGraph;
      },
      prepare: (event: number) => ({ payload: { maxDataOfGraph: event } }),
    },
    changeMaxDataOfTable: {
      reducer: (state, action: PayloadAction<{ maxDataOfTable: number }>) => {
        state.maxDataOfTable = action.payload.maxDataOfTable;
      },
      prepare: (event: number) => ({ payload: { maxDataOfTable: event } }),
    },
    changeSettings: {
      reducer: (state, action: PayloadAction<Omit<SettingState, 'releaseDate' | 'version' | 'license'>>) => {
        state.theme = action.payload.theme;
        state.maxNumOfFrames = action.payload.maxNumOfFrames;
        state.maxNumOfHistories = action.payload.maxNumOfHistories;
        state.maxDataOfGraph = action.payload.maxDataOfGraph;
        state.maxDataOfTable = action.payload.maxDataOfTable;
      },
      prepare: (settings: Omit<SettingState, 'releaseDate' | 'version' | 'license'>) => ({
        payload: {
          theme: settings.theme,
          maxNumOfFrames: settings.maxNumOfFrames,
          maxNumOfHistories: settings.maxNumOfHistories,
          maxDataOfGraph: settings.maxDataOfGraph,
          maxDataOfTable: settings.maxDataOfTable,
        },
      }),
    },
  },
});

export const {
  changeTheme,
  changeMaxNumOfFrames,
  changeMaxNumOfHistories,
  changeMaxDataOfGraph,
  changeMaxDataOfTable,
  changeSettings,
  resetSetting,
} = SidebarSettingSlice.actions;

export default SidebarSettingSlice.reducer;
