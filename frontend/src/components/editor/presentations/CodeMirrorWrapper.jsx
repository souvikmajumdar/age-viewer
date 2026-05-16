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

import React, { useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { keymap } from '@codemirror/view';
import './CodeMirror.scss';

const CodeMirrorWrapper = ({
  value, onChange, commandHistory, onClick,
}) => {
  const [commandHistoryIndex, setCommandHistoryIndex] = useState(-1);

  const handleChange = useCallback((val) => {
    onChange(val);
  }, [onChange]);

  const customKeymap = keymap.of([
    {
      key: 'Shift-Enter',
      run: () => {
        onClick();
        onChange('');
        setCommandHistoryIndex(-1);
        return true;
      },
    },
    {
      key: 'Ctrl-Enter',
      run: () => {
        onClick();
        onChange('');
        setCommandHistoryIndex(-1);
        return true;
      },
    },
    {
      key: 'Ctrl-ArrowUp',
      run: (view) => {
        if (commandHistory.length === 0) return true;
        let newIdx;
        if (commandHistoryIndex === -1) {
          newIdx = commandHistory.length - 1;
        } else if (commandHistoryIndex === 0) {
          newIdx = 0;
        } else {
          newIdx = commandHistoryIndex - 1;
        }
        view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: commandHistory[newIdx] } });
        onChange(commandHistory[newIdx]);
        setCommandHistoryIndex(newIdx);
        return true;
      },
    },
    {
      key: 'Ctrl-ArrowDown',
      run: (view) => {
        if (commandHistory.length === 0) return true;
        if (commandHistoryIndex === -1 || commandHistoryIndex === commandHistory.length - 1) {
          view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: '' } });
          onChange('');
          setCommandHistoryIndex(-1);
          return true;
        }
        const newIdx = commandHistoryIndex + 1;
        view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: commandHistory[newIdx] } });
        onChange(commandHistory[newIdx]);
        setCommandHistoryIndex(newIdx);
        return true;
      },
    },
  ]);

  return (
    <CodeMirror
      id="editor"
      value={value}
      extensions={[sql(), customKeymap]}
      onChange={handleChange}
      placeholder="Create a query..."
      basicSetup={{
        lineNumbers: true,
        tabSize: 4,
      }}
    />
  );
};

export default CodeMirrorWrapper;
