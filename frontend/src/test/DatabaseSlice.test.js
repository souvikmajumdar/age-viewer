import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { changeGraph } from '../features/database/DatabaseSlice';

describe('DatabaseSlice', () => {
  it('has initial state with status init', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({ status: 'init' });
  });

  describe('changeGraph', () => {
    it('updates the graph name', () => {
      const store = configureStore({ reducer: { database: reducer } });
      store.dispatch(changeGraph({ graphName: 'my_graph' }));
      expect(store.getState().database.graph).toBe('my_graph');
    });

    it('preserves other state properties', () => {
      const initialState = {
        host: 'localhost',
        port: '5432',
        user: 'admin',
        database: 'testdb',
        graph: 'old_graph',
        status: 'connected',
      };
      const state = reducer(initialState, changeGraph({ graphName: 'new_graph' }));
      expect(state.graph).toBe('new_graph');
      expect(state.host).toBe('localhost');
      expect(state.status).toBe('connected');
    });
  });

  describe('extraReducers', () => {
    it('sets connected state on connectToDatabase.fulfilled', () => {
      const payload = {
        host: 'localhost',
        port: '5432',
        user: 'postgres',
        password: 'secret',
        database: 'agedb',
        graph: 'test_graph',
      };
      const action = { type: 'database/connectToDatabase/fulfilled', payload };
      const state = reducer(undefined, action);
      expect(state.status).toBe('connected');
      expect(state.host).toBe('localhost');
      expect(state.graph).toBe('test_graph');
    });

    it('sets disconnected state on connectToDatabase.rejected', () => {
      const action = { type: 'database/connectToDatabase/rejected' };
      const state = reducer(undefined, action);
      expect(state.status).toBe('disconnected');
      expect(state.host).toBe('');
      expect(state.graph).toBe('');
    });

    it('sets disconnected state on disconnectToDatabase.fulfilled', () => {
      const connectedState = {
        host: 'localhost',
        port: '5432',
        user: 'admin',
        password: 'pass',
        database: 'db',
        graph: 'g',
        status: 'connected',
      };
      const action = { type: 'database/disconnectToDatabase/fulfilled' };
      const state = reducer(connectedState, action);
      expect(state.status).toBe('disconnected');
      expect(state.host).toBe('');
    });

    it('sets connected state on getConnectionStatus.fulfilled', () => {
      const payload = {
        host: '192.168.1.1',
        port: '5433',
        user: 'user1',
        password: 'pw',
        database: 'mydb',
        graph: 'mygraph',
      };
      const action = { type: 'database/getConnectionStatus/fulfilled', payload };
      const state = reducer(undefined, action);
      expect(state.status).toBe('connected');
      expect(state.host).toBe('192.168.1.1');
      expect(state.database).toBe('mydb');
    });

    it('sets disconnected state on getConnectionStatus.rejected', () => {
      const action = { type: 'database/getConnectionStatus/rejected' };
      const state = reducer(undefined, action);
      expect(state.status).toBe('disconnected');
      expect(state.host).toBe('');
    });
  });
});
