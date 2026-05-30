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

interface CytoscapeConfig {
  zoom: number;
  minZoom: number;
  maxZoom: number;
  zoomingEnabled: boolean;
  userZoomingEnabled: boolean;
  panningEnabled: boolean;
  userPanningEnabled: boolean;
  boxSelectionEnabled: boolean;
  selectionType: string;
  touchTapThreshold: number;
  desktopTapThreshold: number;
  autolock: boolean;
  autoungrabify: boolean;
  autounselectify: boolean;
  headless: boolean;
  styleEnabled: boolean;
  hideEdgesOnViewport: boolean;
  textureOnViewport: boolean;
  motionBlur: boolean;
  motionBlurOpacity: number;
  wheelSensitivity: number;
  pixelRatio: string;
}

const cytoscapeConfig: CytoscapeConfig = {
  zoom: 1,
  minZoom: 0.5,
  maxZoom: 2,
  zoomingEnabled: false,
  userZoomingEnabled: false,
  panningEnabled: true,
  userPanningEnabled: true,
  boxSelectionEnabled: false,
  selectionType: 'single',
  touchTapThreshold: 8,
  desktopTapThreshold: 4,
  autolock: false,
  autoungrabify: false,
  autounselectify: false,
  headless: false,
  styleEnabled: true,
  hideEdgesOnViewport: false,
  textureOnViewport: false,
  motionBlur: false,
  motionBlurOpacity: 0.2,
  wheelSensitivity: 0.5,
  pixelRatio: 'auto',
};

export default cytoscapeConfig;
