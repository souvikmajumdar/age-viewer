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

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Settings, SidePanelOpen, SidePanelClose } from '@carbon/icons-react';
import EditorContainer from '../../contents/containers/Editor';
import Contents from '../../contents/containers/Contents';
import InspectorPanel from '../../inspector/InspectorPanel';
import Modal from '../../modal/containers/Modal';
import SidebarSetting from '../../sidebar/containers/SidebarSetting';
import { loadFromCookie, saveToCookie } from '../../../features/cookie/CookieUtil';
import BuilderContainer from '../../query_builder/BuilderContainer';
import './DefaultTemplate.scss';
import KeyWordFinder from '../../../features/query_builder/KeyWordFinder';

const DefaultTemplate = ({
  theme,
  maxNumOfFrames,
  maxNumOfHistories,
  maxDataOfGraph,
  maxDataOfTable,
  changeSettings,
  isOpen,
}) => {
  const dispatch = useDispatch();
  const [builderOpen, setBuilderOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [panelVisible, setPanelVisible] = useState(true);
  const [stateValues] = useState({
    theme,
    maxNumOfFrames,
    maxNumOfHistories,
    maxDataOfGraph,
    maxDataOfTable,
  });
  const [finder, setFinder] = useState(null);

  const database = useSelector((state) => state.database);

  useEffect(() => {
    async function fetchKeywords() {
      const req = { method: 'GET' };
      const res = await fetch('/api/v1/miscellaneous', req);
      const results = await res.json();
      const kwFinder = KeyWordFinder.fromMatrix(results);
      setFinder(kwFinder);
    }
    fetchKeywords();
  }, []);

  useEffect(() => {
    let isChanged = false;
    const cookieState = {
      theme,
      maxNumOfFrames,
      maxNumOfHistories,
      maxDataOfGraph,
      maxDataOfTable,
    };

    Object.keys(stateValues).forEach((key) => {
      let fromCookieValue = loadFromCookie(key);

      if (fromCookieValue !== undefined && key !== 'theme') {
        fromCookieValue = parseInt(fromCookieValue, 10);
      }

      if (fromCookieValue === undefined) {
        saveToCookie(key, stateValues[key]);
      } else if (fromCookieValue !== stateValues[key]) {
        cookieState[key] = fromCookieValue;
        isChanged = true;
      }
    });

    if (isChanged) {
      dispatch(() => changeSettings(Object.assign(stateValues, cookieState)));
    }
  });

  return (
    <div className={`default-template ${!panelVisible ? 'panel-hidden' : ''}`}>
      {isOpen && <Modal />}

      {/* Hidden theme radios for CSS variable switching */}
      <input type="radio" className="theme-switch" name="theme-switch" id="default-theme" checked={theme === 'default'} readOnly />
      <input type="radio" className="theme-switch" name="theme-switch" id="dark-theme" checked={theme === 'dark'} readOnly />

      {/* ─── EDITOR BAR ─── */}
      <div className="editor-bar">
        <EditorContainer />
      </div>

      {/* ─── LEFT RAIL ─── */}
      <div className="left-rail">
        <button
          type="button"
          className={`rail-btn ${builderOpen ? 'active' : ''}`}
          title="Query Builder"
          onClick={() => setBuilderOpen(!builderOpen)}
        >
          <Menu size={20} />
        </button>
        <button
          type="button"
          className={`rail-btn ${settingsOpen ? 'active' : ''}`}
          title="Settings"
          onClick={() => setSettingsOpen(!settingsOpen)}
        >
          <Settings size={20} />
        </button>
        <button
          type="button"
          className="rail-btn"
          title={panelVisible ? 'Hide Inspector' : 'Show Inspector'}
          onClick={() => setPanelVisible(!panelVisible)}
          style={{ marginTop: 'auto' }}
        >
          {panelVisible ? <SidePanelClose size={20} /> : <SidePanelOpen size={20} />}
        </button>
      </div>

      {/* ─── WORKSPACE (content + inspector) ─── */}
      <div className="workspace">
        <div className="content-area">
          {/* Status bar */}
          {database.status === 'connected' && (
            <div className="status-bar">
              <span className="status-dot" />
              <span>
                Connected as <strong>{database.user || 'user'}</strong> to <strong>{database.host}:{database.port}/{database.database}</strong>
              </span>
            </div>
          )}
          {database.status === 'disconnected' && (
            <div className="status-bar">
              <span className="status-dot disconnected" />
              <span>Not connected</span>
            </div>
          )}

          {/* Frame results */}
          <Contents />
        </div>

        {/* ─── RIGHT PANEL (Inspector) ─── */}
        {panelVisible && <InspectorPanel />}
      </div>

      {/* ─── QUERY BUILDER DRAWER ─── */}
      <BuilderContainer open={builderOpen} setOpen={setBuilderOpen} finder={finder} />

      {/* ─── SETTINGS DRAWER ─── */}
      <div className={`settings-drawer ${settingsOpen ? 'open' : ''}`}>
        <h3>Configuration</h3>
        <SidebarSetting />
      </div>
      {settingsOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 15 }}
          onClick={() => setSettingsOpen(false)}
          role="presentation"
        />
      )}
    </div>
  );
};

export default DefaultTemplate;
