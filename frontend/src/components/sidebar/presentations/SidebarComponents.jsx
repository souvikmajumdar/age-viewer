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

import React from 'react';
import { Dropdown } from '@carbon/react';
import './Components.scss';

const StyleTextRight = {
  marginBottom: '10px', textAlign: 'right', fontSize: '13px', fontWeight: 'bold',
};
const StyleTextLeft = { fontSize: '13px', fontWeight: 'bold' };

export const ColoredLine = () => (
  <hr
    style={{
      color: '#B0B0B0',
      backgroundColor: '#B0B0B0',
      marginTop: 0,
      height: 0.3,
    }}
  />
);

export const VerticalLine = () => (
  <div
    style={{
      backgroundColor: '#C4C4C4',
      width: '1px',
      height: '120px',
      marginTop: '37px',
      marginBottom: '37px',
    }}
  />
);

export const HorizontalLine = () => (
  <div
    className="horizontalLine"
    style={{
      border: '1px solid #C4C4C4',
      opacity: '1',
      width: '80%',
      height: '0',
      margin: '3px auto',
    }}
  />
);

const SubLabelRight = ({ label, classes }) => (
  <div className={classes} style={StyleTextRight}>{label}</div>
);

const SubLabelLeft = ({ label, classes }) => (
  <div className={classes} style={StyleTextLeft}>{label}</div>
);

const SubLabelLeftWithLink = ({ label, classes }) => (
  <div className={classes} style={StyleTextLeft}><pre>{label}</pre></div>
);

const GraphSelectDropdown = ({
  currentGraph, graphs, changeCurrentGraph, changeGraphDB,
}) => {
  const selectStyle = {
    marginTop: '1rem',
    display: 'block',
  };

  return (
    <div id="graphSelectionContainer">
      <Dropdown
        id="graph-selection"
        items={graphs.map(([gname, graphId]) => ({ id: graphId, label: gname }))}
        itemToString={(item) => item?.label || ''}
        onChange={({ selectedItem }) => { changeCurrentGraph({ id: selectedItem.id }); changeGraphDB({ graphName: selectedItem.label }); }}
        label="Select Graph"
        selectedItem={graphs.find(([gname]) => gname === currentGraph) ? { id: graphs.find(([gname]) => gname === currentGraph)[1], label: currentGraph } : null}
        style={selectStyle}
      />
      <br />
      <b>
        Current Graph
      </b>
    </div>
  );
};

export {
  SubLabelRight, SubLabelLeft, SubLabelLeftWithLink, GraphSelectDropdown,
};
