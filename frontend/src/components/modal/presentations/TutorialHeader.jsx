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

const TutorialHeader = ({ page }) => (
  <div style={{ padding: '0.3rem 0.5rem', borderBottom: '1px solid black', background: '#A9A9A9' }}>
    <h5 style={{ fontSize: '0.88rem', color: '#F0FFF0', margin: 0 }}>
      {`Tip of AGE Viewer - ${page}`}
    </h5>
  </div>
);

export default TutorialHeader;
