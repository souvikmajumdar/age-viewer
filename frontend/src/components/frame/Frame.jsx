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
import {
  ChevronDown,
  ChevronUp,
  Minimize,
  Maximize,
  Renew,
  Close,
  Copy,
} from '@carbon/icons-react';
import { Button, Popover, PopoverContent } from '@carbon/react';
import { useDispatch } from 'react-redux';
import styles from './Frame.module.scss';
import { removeFrame } from '../../features/frame/FrameSlice';
import { setCommand } from '../../features/editor/EditorSlice';
import { removeActiveRequests } from '../../features/cypher/CypherSlice';
import EdgeWeight from '../../icons/EdgeWeight';
import IconFilter from '../../icons/IconFilter';
import IconSearchCancel from '../../icons/IconSearchCancel';

const Frame = ({
  reqString,
  children,
  refKey,
  onSearch = null,
  onSearchCancel = null,
  onRefresh = null,
  onThick = null,
  thicnessMenu = null,
  bodyNoPadding = false,
  isTable,
}) => {
  const dispatch = useDispatch();
  const [isFullScreen, setFullScreen] = useState(false);
  const [isExpand, setExpand] = useState(true);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // const downloadMenu = () => (
  //   <Menu onClick={(e) => onDownload(e)}>
  //     <Menu.Item key="png">
  //       Save as PNG
  //     </Menu.Item>
  //     <Menu.Item key="json">
  //       Save as JSON
  //     </Menu.Item>
  //     <Menu.Item key="csv">
  //       Save as CSV
  //     </Menu.Item>
  //   </Menu>
  // );

  return (
    <div className={`${styles.Frame} ${isFullScreen ? styles.FullScreen : ''}`}>
      <div className={styles.FrameHeader}>
        <div className={styles.FrameHeaderText}>
          {'$ '}
          <strong>
            {reqString}
          </strong>
          <Copy
            id={styles.toEditor}
            title="copy to editor"
            size={16}
            onClick={() => dispatch(setCommand(reqString))}
            style={{
              cursor: 'pointer',
            }}
          />
        </div>
        <div className={styles.ButtonArea}>
          {!isTable && onThick ? (
            <Popover open={popoverOpen}>
              <Button
                kind="ghost"
                size="lg"
                className={styles.FrameButton}
                title="Edge Weight"
                onClick={() => { onThick(); setPopoverOpen(!popoverOpen); }}
              >
                <EdgeWeight />
              </Button>
              <PopoverContent>
                {thicnessMenu}
              </PopoverContent>
            </Popover>
          ) : null}
          {onSearchCancel ? (
            <Button
              kind="ghost"
              size="lg"
              className={styles.FrameButton}
              onClick={() => onSearchCancel()}
              title="Cancel Search"
            >
              <IconSearchCancel />
            </Button>
          ) : null}
          {onSearch ? (
            <Button
              kind="ghost"
              size="lg"
              className={styles.FrameButton}
              onClick={() => onSearch()}
              title="Filter/Search"
            >
              <IconFilter />
            </Button>
          ) : null}
          {/* {false ? ( // en:Functionality is hidden due to */}
          {/* functional problems // ko:기능이 동작하지 않아 감춤 */}
          {/*  <Dropdown */}
          {/*    trigger={['click']} */}
          {/*    overlay={downloadMenu} */}
          {/*  > */}
          {/*    <Button */}
          {/*      kind="ghost" */}
          {/*      size="lg" */}
          {/*      className={styles.FrameButton} */}
          {/*    > */}
          {/*      <FontAwesomeIcon */}
          {/*        icon={faDownload} */}
          {/*        size="lg" */}
          {/*      /> */}
          {/*      <FontAwesomeIcon icon={faAngleDown} /> */}
          {/*    </Button> */}
          {/*  </Dropdown> */}
          {/* ) */}
          {/*  : null} */}
          <Button
            kind="ghost"
            size="lg"
            className={`${styles.FrameButton} ${
              isFullScreen ? styles.activate : ''
            }`}
            onClick={() => setFullScreen(!isFullScreen)}
            title="Expand"
          >
            {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </Button>
          {
            !isTable && onRefresh ? (
              <Button
                kind="ghost"
                size="lg"
                className={`${styles.FrameButton}`}
                onClick={() => onRefresh()}
                title="Refresh"
              >
                <Renew size={20} />
              </Button>
            ) : null
          }
          {/* <Button
            kind="ghost"
            size="lg"
            className={`${styles.FrameButton} ${isPinned ? styles.activate : ''}`}
            onClick={() => pinFrame(refKey)}
          >
          <FontAwesomeIcon icon={faPaperclip}
              size="lg"
            />
          </Button> */}
          <Button
            kind="ghost"
            size="lg"
            className={`${styles.FrameButton}`}
            onClick={() => setExpand(!isExpand)}
            title={isExpand ? 'Hide' : 'Show'}
          >
            {isExpand ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </Button>
          <Button
            kind="ghost"
            size="lg"
            className={`${styles.FrameButton}`}
            onClick={() => {
              if (window.confirm('Are you sure you want to close this window?')) {
                dispatch(removeFrame(refKey));
                dispatch(removeActiveRequests(refKey));
              } else {
                // Do nothing!
              }
            }}
            title="Close Window"
          >
            <Close size={20} />
          </Button>
        </div>
      </div>
      <div
        className={`${styles.FrameBody} ${isExpand ? '' : styles.Contract} ${
          bodyNoPadding ? styles.NoPadding : ''
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Frame;
