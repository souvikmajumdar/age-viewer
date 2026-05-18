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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// html2canvas is not installed as a package; declare a minimal type to satisfy TypeScript
declare function html2canvas(element: HTMLElement): Promise<HTMLCanvasElement>;

export const Capture = createSlice({
  name: 'capture',
  initialState: [] as unknown[],
  reducers: {
    capturePng: {
      reducer: (state, action: PayloadAction<{ refKey: string }>) => {
        const frameKey = action.payload.refKey;
        state.splice(state.findIndex((frame: unknown) => (frame as { frameProps: { key: string } }).frameProps.key === frameKey), 1);
        state.map((frame) => {
          html2canvas(frame as HTMLElement).then((canvas) => {
            const saveImgLink = canvas.toDataURL();
            const link = document.createElement('a');
            link.download = 'saveimage';
            link.href = saveImgLink;
            link.click();
          });
          return frame;
        });
      },
      prepare: (refKey: string) => ({ payload: { refKey } }),
    },
  },
});

export const { capturePng } = Capture.actions;
export default Capture.reducer;
