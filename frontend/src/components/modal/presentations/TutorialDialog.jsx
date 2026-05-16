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

import React, { useState } from 'react';
import { Modal } from '@carbon/react';
import TutorialFooter from './TutorialFooter';
import TutorialBody from './TutorialBody';

const getTextForPage = (page) => {
  const texts = {
    1: 'Apache-Age Viewer is a web based user interface that provides visualization of graph data stored in a postgreSQL database with AGE extension. It is graph visualisation tool, for Apache AGE.',
    2: 'A graph consists of a set of vertices and edges, where each individual node and edge possesses a map of properties. You can use the Query Editor to create and run scripts containing cypher query statements.',
    3: 'This feature allows users to create and initialize a graph using csv file.ID is required when initializing.',
    4: 'After creating nodes/edges and running queries, you can select a menu item and perform a command on either a node or a edge in frame.',
    5: 'There are multiple ways you can contribute to the Apache AGE and Apache AGE Viewer projects. If you are interested in the project and looking for ways to help, consult the list of projects in the Apache AGE and AGE Viewer GitHubs.',
  };
  return texts[page] || '';
};

const getAddiTextForPage = (page) => {
  if (page === 2) return 'You can get previous commands using ctrl + ↑/ctrl+ ↓ keyboard shortcut. The below icon also allows previous queries to be copied to editor.';
  if (page === 3) return 'https://age.apache.org/age-manual/master/intro/agload.html#explanation-about-the-csv-format';
  return '';
};

const TutorialDialog = ({ closeTutorial }) => {
  const [page, setPage] = useState(1);

  return (
    <div className="tutorialModal-container">
      <Modal
        open
        passiveModal
        modalHeading={`Tip of AGE Viewer - ${page}`}
        onRequestClose={closeTutorial}
        size="sm"
      >
        <TutorialBody page={page} text={getTextForPage(page)} addiText={getAddiTextForPage(page)} />
        <TutorialFooter page={page} setPage={setPage} closeTutorial={closeTutorial} />
      </Modal>
    </div>
  );
};

export default TutorialDialog;
