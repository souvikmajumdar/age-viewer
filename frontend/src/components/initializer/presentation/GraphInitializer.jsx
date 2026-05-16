import React, { useState, useRef } from 'react';
import { Modal, Button, TextInput, Checkbox, Loading, InlineNotification } from '@carbon/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import uuid from 'react-uuid';
import './GraphInit.scss';
import { useDispatch } from 'react-redux';
import { addAlert } from '../../../features/alert/AlertSlice';
import { changeGraph } from '../../../features/database/DatabaseSlice';
import { changeCurrentGraph, getMetaData } from '../../../features/database/MetadataSlice';

const InitGraphModal = ({ show, setShow }) => {
  const [nodeFiles, setNodeFiles] = useState({});
  const [edgeFiles, setEdgeFiles] = useState({});
  const [graphName, setGraphName] = useState('');
  const [dropGraph, setDropGraph] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const edgeInputRef = useRef();
  const nodeInputRef = useRef();
  const dispatch = useDispatch();

  const clearState = () => {
    setNodeFiles({});
    setEdgeFiles({});
    setGraphName('');
    setDropGraph(false);
    setLoading(false);
    setError('');
  };
  const handleSelectNodeFiles = (e) => {
    Array.from(e.target.files).forEach((file) => {
      const key = uuid();
      nodeFiles[key] = {
        data: file,
        name: '',
      };
    });
    setNodeFiles({ ...nodeFiles });
    nodeInputRef.current.value = '';
  };

  const handleSelectEdgeFiles = (e) => {
    Array.from(e.target.files).forEach((file) => {
      const key = uuid();
      edgeFiles[key] = {
        data: file,
        name: '',
      };
    });
    setEdgeFiles({ ...edgeFiles });
    edgeInputRef.current.value = '';
  };

  const removeNodeFile = (k) => {
    delete nodeFiles[k];
    setNodeFiles({ ...nodeFiles });
  };

  const removeEdgeFile = (k) => {
    delete edgeFiles[k];
    setEdgeFiles({ ...edgeFiles });
  };
  const setName = (name, key, type) => {
    if (type === 'node') {
      const fileProps = nodeFiles[key];
      fileProps.name = name;
    }
    if (type === 'edge') {
      const fileProps = edgeFiles[key];
      fileProps.name = name;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const sendFiles = new FormData();

    Object.entries(nodeFiles).forEach(([, node]) => sendFiles.append('nodes', node.data, node.name));
    Object.entries(edgeFiles).forEach(([, edge]) => sendFiles.append('edges', edge.data, edge.name));
    sendFiles.append('graphName', graphName);
    sendFiles.append('dropGraph', dropGraph);
    const reqData = {
      method: 'POST',
      body: sendFiles,
      mode: 'cors',

    };
    fetch('/api/v1/cypher/init', reqData)
      .then(async (res) => {
        setLoading(false);

        if (res.status !== 204) {
          const resData = await res.json();
          throw resData;
        } else {
          setShow(false);
          dispatch(addAlert('CreateGraphSuccess'));
          dispatch(getMetaData()).then(() => {
            dispatch(changeCurrentGraph({ name: graphName }));
            dispatch(changeGraph({ graphName }));
          });
        }
      })
      .catch((err) => {
        console.log('error', err);
        setLoading(false);
        setError(err);
      });
  };

  const modalInputBody = () => (
    <>
      <div className="graphInputCol">
        <div id="graphInputRow">
          <TextInput
            id="graphNameInput"
            labelText="Graph Name"
            type="text"
            placeholder="graph name"
            value={graphName}
            onChange={(e) => setGraphName(e.target.value)}
            required
          />
        </div>
        <div id="graphInputRow">
          <Checkbox
            id="dropGraphCheckbox"
            labelText="DROP graph if exists"
            onChange={(_, { checked }) => setDropGraph(checked)}
            checked={dropGraph}
          />
        </div>
      </div>
      <hr />
      <div className="modalRow" style={{ display: 'flex', gap: '8px' }}>
        <Button onClick={() => nodeInputRef.current.click()}>
          Upload Nodes
          <input type="file" ref={nodeInputRef} onChange={handleSelectNodeFiles} accept=".csv" multiple hidden />
        </Button>
        <Button onClick={() => edgeInputRef.current.click()}>
          Upload Edges
          <input type="file" ref={edgeInputRef} onChange={handleSelectEdgeFiles} accept=".csv" multiple hidden />
        </Button>
      </div>
      <div className="modalRow" style={{ display: 'flex', gap: '16px' }}>
        <div>
          <ul className="readyFiles" style={{ listStyle: 'none', padding: 0 }}>
            {
              Object.entries(nodeFiles).map(([k, { data: file, name }]) => (
                <li key={k} style={{ marginBottom: '8px' }}>
                  <div className="modalRow">
                    <TextInput
                      id={`nodeLabel-${k}`}
                      labelText=""
                      hideLabel
                      placeholder="label name"
                      data-key={k}
                      defaultValue={name}
                      onChange={(e) => {
                        setName(e.target.value, k, 'node');
                      }}
                      required
                    />
                  </div>
                  <div className="modalRow" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{file.name}</span>
                    <FontAwesomeIcon
                      id="removeFile"
                      data-id={k}
                      onClick={() => removeNodeFile(k)}
                      icon={faMinusCircle}
                    />
                  </div>
                </li>
              ))
          }
          </ul>
        </div>
        <div>
          <ul className="readyFiles" style={{ listStyle: 'none', padding: 0 }}>
            {
              Object.entries(edgeFiles).map(([k, { data: file, name }]) => (
                <li key={k} style={{ marginBottom: '8px' }}>
                  <div className="modalRow">
                    <TextInput
                      id={`edgeLabel-${k}`}
                      labelText=""
                      hideLabel
                      data-key={k}
                      onChange={(e) => {
                        setName(e.target.value, k, 'edge');
                      }}
                      placeholder="edge name"
                      defaultValue={name}
                      required
                    />
                  </div>
                  <div className="modalRow" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{file.name}</span>
                    <FontAwesomeIcon
                      id="removeFile"
                      data-id={k}
                      onClick={() => removeEdgeFile(k)}
                      icon={faMinusCircle}
                    />
                  </div>
                </li>
              ))
          }
          </ul>
        </div>
      </div>
    </>
  );

  const modalBody = () => {
    if (loading) return <Loading withOverlay={false} />;
    if (error !== '') {
      return (
        <InlineNotification
          kind="error"
          title="An error occured"
          subtitle={`Error Code: ${error.code} - Error Details: ${error.details}`}
          onCloseButtonClick={() => setError('')}
        />
      );
    }
    return modalInputBody();
  };

  return (
    <div>
      <Modal
        open={show}
        modalHeading="Create a Graph"
        primaryButtonText="Done"
        secondaryButtonText="Clear"
        onRequestClose={() => setShow(!show)}
        onRequestSubmit={handleSubmit}
        onSecondarySubmit={clearState}
      >
        {modalBody()}
      </Modal>
    </div>
  );
};

export default InitGraphModal;
