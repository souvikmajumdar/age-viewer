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
import type { FrameState } from '../../types/redux';

const FrameSlice = createSlice({
  name: 'frames',
  initialState: [] as FrameState,
  reducers: {
    addFrame: {
      reducer: (state, action: PayloadAction<{ reqString: string; frameName: string; refKey?: string }>) => {
        const reqString = action.payload.reqString.trim();
        const firstNotPinnedIndex = state.findIndex((frame) => (frame.isPinned === false));
        const { frameName } = action.payload;

        const frameProps: { reqString: string; key: string; playTarget?: string } = {
          reqString,
          key: action.payload.refKey ? action.payload.refKey : crypto.randomUUID(),
        };

        if (reqString.startsWith(':play')) {
          frameProps.playTarget = reqString.split(/\s+/).pop();
        }

        state.splice(firstNotPinnedIndex, 0, { frameName, frameProps, isPinned: false });
        state.map((frame) => { if (frame.orgIndex) { frame.orgIndex += 1; } return frame; });
      },
      prepare: (reqString: string, frameName: string, refKey?: string) => ({ payload: { reqString, frameName, refKey } }),
    },
    removeFrame: {
      reducer: (state, action: PayloadAction<{ refKey: string }>) => {
        const frameKey = action.payload.refKey;
        return state.filter((frame) => frame.frameProps.key !== frameKey);
      },
      prepare: (refKey: string) => ({ payload: { refKey } }),
    },
    pinFrame: {
      reducer: (state, action: PayloadAction<{ refKey: string }>) => {
        const frameKey = action.payload.refKey;
        const frameIndex = state.findIndex((frame) => (frame.frameProps.key === frameKey));
        if (!state[frameIndex].isPinned) {
          state[frameIndex].isPinned = true;
          state[frameIndex].orgIndex = frameIndex;
          state.splice(0, 0, state.splice(frameIndex, 1)[0]);
        } else {
          state[frameIndex].isPinned = false;
          const indexMoveTo = state[frameIndex].orgIndex;
          state.splice(indexMoveTo, 0, state.splice(frameIndex, 1)[0]);
        }
      },
      prepare: (refKey: string) => ({ payload: { refKey } }),
    },
    trimFrame: {
      reducer: (state, action: PayloadAction<{ frameName: string }>) => {
        const { frameName } = action.payload;
        return state.filter((frame) => (frame.frameName !== frameName));
      },
      prepare: (frameName: string) => ({ payload: { frameName } }),
    },
  },
});

export const {
  addFrame, removeFrame, pinFrame, trimFrame,
} = FrameSlice.actions;

export default FrameSlice.reducer;
