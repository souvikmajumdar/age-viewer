import React from 'react';
import { Button } from '@carbon/react';
import uuid from 'react-uuid';

const BuilderSelection = ({ finder, setQuery, currentWord }) => {
  const handleClick = (e) => {
    const selectedVal = e.target.getAttribute('data-val');
    setQuery(selectedVal);
  };
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {
        finder?.getConnectedNames(currentWord).map(
          (element) => (
            <li key={uuid()} style={{ marginBottom: '4px' }}>
              <Button
                kind="ghost"
                size="sm"
                onClick={handleClick}
                data-val={element}
              >
                {element}
              </Button>
            </li>
          ),
        )
      }
    </ul>
  );
};

export default BuilderSelection;
