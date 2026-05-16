import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dropdown } from '@carbon/react';
import CodeMirror from '../editor/containers/CodeMirrorWapperContainer';
import BuilderSelection from './BuilderSelection';
import KeyWordFinder from '../../features/query_builder/KeyWordFinder';

import { setCommand } from '../../features/editor/EditorSlice';
import './BuilderContainer.scss';

const BuilderContainer = ({ open, setOpen, finder }) => {
  const [query, setQuery] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [selectedGraph, setSelectedGraph] = useState('');
  const [availableGraphs, setAvailableGraphs] = useState([]);
  const metadata = useSelector((state) => state.metadata);
  const dispatch = useDispatch();
  useEffect(() => {
    setAvailableGraphs(Object.keys(metadata.graphs));
  }, [metadata]);

  const getCurrentWord = (q) => {
    const words = q.split(/[ ,\n]/);
    const isWord = words.findLast((element) => finder.hasWord(element));
    const word = isWord || '';
    setCurrentWord(word);
  };

  const handleSetQuery = (word) => {
    const fullQuery = query !== '' ? `${query.trim()}\n${word}` : word;

    setQuery(fullQuery);
    getCurrentWord(fullQuery);
  };
  const handleSelectGraph = (s) => {
    setSelectedGraph(s);
  };

  const handleSubmit = () => {
    const finalQuery = `SELECT * FROM cypher('${selectedGraph}', $$ ${query} $$) as (V agtype)`;
    dispatch((setCommand(finalQuery)));
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="query-builder-panel"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '400px',
        zIndex: 1000,
        background: '#fff',
        boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
        padding: '1rem',
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4>Query Generator</h4>
        <Button kind="ghost" size="sm" onClick={() => setOpen(false)}>Close</Button>
      </div>

      <Dropdown
        id="graph-selection"
        items={availableGraphs.map((s) => ({ id: s, label: s }))}
        itemToString={(item) => item?.label || ''}
        onChange={({ selectedItem }) => handleSelectGraph(selectedItem?.id || '')}
        label="Select Graph"
        selectedItem={selectedGraph ? { id: selectedGraph, label: selectedGraph } : null}
      />

      <div className="code-mirror-builder" style={{ marginTop: '1rem' }}>
        <CodeMirror onChange={handleSetQuery} value={query} />
      </div>

      <div className="selection-builder" style={{ marginTop: '1rem' }}>
        <BuilderSelection
          finder={finder}
          setQuery={handleSetQuery}
          currentWord={currentWord}
        />
      </div>
      <div id="submit-builder" style={{ marginTop: '1rem' }}>
        <Button size="sm" onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
};

export default BuilderContainer;
