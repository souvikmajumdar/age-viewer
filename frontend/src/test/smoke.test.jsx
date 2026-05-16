import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../app/reducers';

describe('Test Infrastructure', () => {
  it('vitest runs correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('jsdom environment is available', () => {
    expect(document).toBeDefined();
    expect(document.createElement).toBeDefined();
  });

  it('Redux store initializes without crashing', () => {
    const store = configureStore({ reducer: rootReducer });
    const state = store.getState();
    expect(state).toHaveProperty('database');
    expect(state).toHaveProperty('metadata');
    expect(state).toHaveProperty('frames');
    expect(state).toHaveProperty('cypher');
    expect(state.database.status).toBe('init');
  });
});
