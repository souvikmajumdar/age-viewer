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
import { FileUploader } from '@carbon/react';
import { useDispatch } from 'react-redux';
import Frame from '../frame/Frame';
import { getMetaData } from '../../features/database/MetadataSlice';
import { useNotification } from '../../hooks/useNotification';

const CSV = ({ reqString, refKey }) => {
  const dispatch = useDispatch();
  const notify = useNotification();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/v1/feature/uploadCSV', {
        method: 'POST',
        headers: { authorization: 'authorization-text' },
        body: formData,
      });
      if (res.ok) {
        dispatch(getMetaData());
        notify.success(`${file.name} file uploaded successfully`);
      } else {
        notify.error(`${file.name} file upload failed.`);
      }
    } catch {
      notify.error(`file upload failed.`);
    }
  };

  return (
    <Frame
      reqString={reqString}
      refKey={refKey}
    >
      <FileUploader
        labelTitle="Upload CSV"
        labelDescription="Choose a CSV file to upload"
        buttonLabel="Click to Upload"
        accept={['.csv']}
        onChange={handleFileChange}
      />
    </Frame>
  );
};

export default CSV;
