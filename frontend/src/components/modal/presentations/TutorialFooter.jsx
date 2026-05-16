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

import React, { useState, useEffect } from 'react';
import { Button } from '@carbon/react';

const TutorialFooter = ({ page, setPage, closeTutorial }) => {
  const [curPage, setCurPage] = useState();

  useEffect(() => {
    setCurPage(page);
  }, [page]);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem' }}>
      <div>
        <Button onClick={() => closeTutorial()} className="tutorial-button" kind="secondary">Close</Button>
      </div>
      <div>
        <Button className="tutorial-button" kind={curPage === 1 ? 'ghost' : 'secondary'} disabled={curPage === 1} style={{ marginRight: '1rem' }} onClick={() => { setPage(curPage > 1 ? curPage - 1 : curPage); }}>Previous Tip</Button>
        <Button className="tutorial-button" kind={curPage === 5 ? 'ghost' : 'primary'} disabled={curPage === 5} onClick={() => { setPage(curPage < 5 ? curPage + 1 : curPage); }}>Next Tip</Button>
      </div>
    </div>
  );
};

export default TutorialFooter;
