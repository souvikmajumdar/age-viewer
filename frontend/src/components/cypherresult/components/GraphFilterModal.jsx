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

import React, { useEffect, useState } from 'react';
import { Modal, TextInput, Dropdown, Button } from '@carbon/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import uuid from 'react-uuid';
import { useNotification } from '../../../hooks/useNotification';

const generateNewFilterObject = () => ({
  key: uuid(),
  keyword: null,
  property: null,
});

const GraphFilterModal = ({
  visible,
  setVisible,
  onSubmit,
  properties,
  globalFilter,
  isTable,
}) => {
  const [filterList, setFilterList] = useState([
    generateNewFilterObject(),
  ]);
  const [filterElements, setFilterElements] = useState(null);
  const notify = useNotification();

  useEffect(() => {
    if (visible === true && globalFilter === null) {
      setFilterElements(null);
    }
  }, [visible]);

  const onFilterAdd = (index) => {
    const newFilterList = [...filterList];
    newFilterList.splice(index + 1, 0, generateNewFilterObject());
    setFilterList(newFilterList);
  };

  const onFilterDelete = (index) => {
    const newFilterList = [...filterList];
    newFilterList.splice(index, 1);
    setFilterList(newFilterList);
  };

  const onOk = () => {
    let failed = false;
    const filter = filterList.map((filterItem) => {
      if (filterItem.property === null) {
        failed = true;
        return null;
      }
      return {
        key: filterItem.key,
        keyword: filterItem.keyword,
        property: JSON.parse(filterItem.property),
      };
    });

    if (failed) {
      notify.error('cannot leave with empty property.');
      return;
    }

    onSubmit(filter);
    setVisible(false);
  };

  useEffect(() => {
    const filterListLength = filterList.length;
    const dropdownItems = properties ? properties.map((p) => ({ id: JSON.stringify(p), label: `[${p.label}] ${p.property}` })) : [];

    setFilterElements(
      filterList.map((filter, index) => (
        <div
          key={filter.key}
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Dropdown
            id={`filter-property-${index}`}
            items={dropdownItems}
            itemToString={(item) => item?.label || ''}
            onChange={({ selectedItem }) => { filterList[index].property = selectedItem?.id || null; }}
            label="Select"
            style={{ minWidth: 300 }}
          />
          <div style={{ width: '1px' }} />
          <TextInput
            id={`filter-keyword-${index}`}
            labelText=""
            hideLabel
            style={{ flex: 1 }}
            defaultValue={(globalFilter === null) ? '' : filterList[index].keyword}
            onChange={(event) => {
              filterList[index].keyword = event.target.value;
              setFilterList([...filterList]);
            }}
          />
          <Button kind="ghost" onClick={() => onFilterAdd(index)}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
          {filterListLength > 1 ? (
            <Button kind="ghost" onClick={() => onFilterDelete(index)}>
              <FontAwesomeIcon icon={faMinus} />
            </Button>
          ) : null}
        </div>
      )),
    );
  }, [properties, filterList]);

  return (
    <Modal
      open={visible}
      modalHeading={isTable ? 'Filter Data in Table' : 'Filter on Graph'}
      primaryButtonText="OK"
      secondaryButtonText="Cancel"
      onRequestClose={() => setVisible(false)}
      onRequestSubmit={onOk}
    >
      {filterElements}
    </Modal>
  );
};

export default GraphFilterModal;
