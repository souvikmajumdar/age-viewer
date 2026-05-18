/*
 * InspectorPanel — Right-side panel showing graph metadata
 * Sections are draggable to reorder.
 */

import React, { useState, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Renew, Close } from '@carbon/icons-react';
import { Dropdown } from '@carbon/react';
import { setCommand } from '../../features/editor/EditorSlice';
import { addFrame, trimFrame } from '../../features/frame/FrameSlice';
import { changeGraph } from '../../features/database/DatabaseSlice';
import { getMetaData, changeCurrentGraph } from '../../features/database/MetadataSlice';

const genLabelQuery = (eleType, labelName, graph) => {
  if (eleType === 'node') {
    if (labelName === '*') {
      return `SELECT * from cypher('${graph}', $$ MATCH (V) RETURN V $$) as (V agtype);`;
    }
    return `SELECT * from cypher('${graph}', $$ MATCH (V:${labelName}) RETURN V $$) as (V agtype);`;
  }
  if (eleType === 'edge') {
    if (labelName === '*') {
      return `SELECT * from cypher('${graph}', $$ MATCH (V)-[R]-(V2) RETURN V,R,V2 $$) as (V agtype, R agtype, V2 agtype);`;
    }
    return `SELECT * from cypher('${graph}', $$ MATCH (V)-[R:${labelName}]-(V2) RETURN V,R,V2 $$) as (V agtype, R agtype, V2 agtype);`;
  }
  return '';
};

const genPropQuery = (eleType, propertyName) => {
  if (eleType === 'v') return `MATCH (V) WHERE V.${propertyName} IS NOT NULL RETURN V`;
  if (eleType === 'e') return `MATCH (V)-[R]->(V2) WHERE R.${propertyName} IS NOT NULL RETURN *`;
  return '';
};

const InspectorPanel = ({
  nodes,
  edges,
  propertyKeys,
  currentGraph,
  graphs,
  command,
  setCommand: setCmd,
  trimFrame: trimFrm,
  addFrame: addFrm,
  getMetaData: getMeta,
  changeCurrentGraph: changeCurrent,
  changeGraph: changeG,
}) => {
  const dispatch = useDispatch();
  const [sections, setSections] = useState(['nodes', 'edges', 'properties']);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    dragOverItem.current = index;
  };

  const handleDrop = () => {
    const newSections = [...sections];
    const draggedItem = newSections[dragItem.current];
    newSections.splice(dragItem.current, 1);
    newSections.splice(dragOverItem.current, 0, draggedItem);
    setSections(newSections);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const refreshMeta = () => {
    getMeta({ currentGraph });
  };

  const requestDisconnect = () => {
    const refKey = crypto.randomUUID();
    dispatch(() => trimFrm('ServerDisconnect'));
    dispatch(() => addFrm(command, 'ServerDisconnect', refKey));
  };

  const handleGraphChange = ({ selectedItem }) => {
    if (selectedItem) {
      changeCurrent({ id: selectedItem.id });
      changeG({ graphName: selectedItem.label });
    }
  };

  const renderSection = (sectionKey, index) => {
    switch (sectionKey) {
      case 'nodes':
        return (
          <div
            key="nodes"
            className="panel-section"
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
          >
            <div className="section-header">
              <span className="section-title">Node Labels</span>
              <span className="drag-handle">⋮⋮</span>
            </div>
            <div className="tag-list">
              {nodes && nodes.length > 0 ? (
                nodes.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="tag node"
                    onClick={() => setCmd(genLabelQuery('node', item.label, currentGraph))}
                  >
                    {item.label} ({item.cnt})
                  </button>
                ))
              ) : (
                <span className="empty-state">No labels available</span>
              )}
            </div>
          </div>
        );

      case 'edges':
        return (
          <div
            key="edges"
            className="panel-section"
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
          >
            <div className="section-header">
              <span className="section-title">Edge Labels</span>
              <span className="drag-handle">⋮⋮</span>
            </div>
            <div className="tag-list">
              {edges && edges.length > 0 ? (
                edges.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="tag edge"
                    onClick={() => setCmd(genLabelQuery('edge', item.label, currentGraph))}
                  >
                    {item.label} ({item.cnt})
                  </button>
                ))
              ) : (
                <span className="empty-state">No labels available</span>
              )}
            </div>
          </div>
        );

      case 'properties':
        return (
          <div
            key="properties"
            className="panel-section"
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
          >
            <div className="section-header">
              <span className="section-title">Properties</span>
              <span className="drag-handle">⋮⋮</span>
            </div>
            <div className="tag-list">
              {propertyKeys && propertyKeys.length > 0 ? (
                propertyKeys.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className="tag prop"
                    onClick={() => setCmd(genPropQuery(item.key_type, item.key))}
                  >
                    {item.key}
                  </button>
                ))
              ) : (
                <span className="empty-state">No properties available</span>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const graphItems = graphs.map(([gname, gid]) => ({ id: gid, label: gname }));
  const selectedGraphItem = graphItems.find((g) => g.label === currentGraph) || null;

  return (
    <div className="right-panel">
      {/* Graph selector */}
      <div className="graph-select">
        <Dropdown
          id="inspector-graph-select"
          titleText="Current Graph"
          items={graphItems}
          itemToString={(item) => item?.label || ''}
          selectedItem={selectedGraphItem}
          onChange={handleGraphChange}
          size="sm"
          label="Select Graph"
        />
      </div>

      {/* Draggable sections */}
      {sections.map((section, index) => renderSection(section, index))}

      {/* Footer actions */}
      <div className="panel-footer">
        <button type="button" onClick={refreshMeta}>
          <Renew size={14} /> Refresh
        </button>
        <button
          type="button"
          className="danger"
          onClick={() => {
            if (window.confirm('Disconnect from database?')) {
              requestDisconnect();
            }
          }}
        >
          <Close size={14} /> Disconnect
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const currentGraphData = state.metadata.graphs[state.metadata.currentGraph] || {};
  return {
    currentGraph: state.metadata.currentGraph,
    graphs: Object.entries(state.metadata.graphs).map(([k, v]) => [k, v.id]),
    edges: currentGraphData.edges,
    nodes: currentGraphData.nodes,
    propertyKeys: currentGraphData.propertyKeys,
    command: state.editor.command,
  };
};

const mapDispatchToProps = {
  setCommand,
  addFrame,
  trimFrame,
  getMetaData,
  changeCurrentGraph,
  changeGraph,
};

export default connect(mapStateToProps, mapDispatchToProps)(InspectorPanel);
