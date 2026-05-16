import { describe, it, expect, vi, beforeEach } from 'vitest';
import reducer, { addAlert, removeAlert } from '../features/alert/AlertSlice';

describe('AlertSlice', () => {
  beforeEach(() => {
    vi.stubGlobal('crypto', { randomUUID: () => 'test-uuid' });
  });

  it('has an empty array as initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual([]);
  });

  describe('addAlert', () => {
    it('adds an alert with alertName and generated key', () => {
      const state = reducer([], addAlert('SomeAlert', 'Something happened'));
      expect(state).toHaveLength(1);
      expect(state[0].alertName).toBe('SomeAlert');
      expect(state[0].alertProps.key).toBe('test-uuid');
    });

    it('sets alertType to Error for ErrorServerConnectFail', () => {
      const state = reducer([], addAlert('ErrorServerConnectFail', 'Connection failed'));
      expect(state[0].alertProps.alertType).toBe('Error');
    });

    it('sets alertType to Error for ErrorNoDatabaseConnected', () => {
      const state = reducer([], addAlert('ErrorNoDatabaseConnected'));
      expect(state[0].alertProps.alertType).toBe('Error');
    });

    it('sets alertType to Error for ErrorPlayLoadFail', () => {
      const state = reducer([], addAlert('ErrorPlayLoadFail', 'Load failed'));
      expect(state[0].alertProps.alertType).toBe('Error');
    });

    it('sets alertType to Notice for non-error alerts', () => {
      const state = reducer([], addAlert('InfoMessage', 'Just info'));
      expect(state[0].alertProps.alertType).toBe('Notice');
    });

    it('stores errorMessage from message parameter', () => {
      const state = reducer([], addAlert('SomeAlert', 'Detailed message'));
      expect(state[0].alertProps.errorMessage).toBe('Detailed message');
    });

    it('defaults errorMessage to empty string when not provided', () => {
      const state = reducer([], addAlert('SomeAlert'));
      expect(state[0].alertProps.errorMessage).toBe('');
    });
  });

  describe('removeAlert', () => {
    it('removes an alert by key', () => {
      const stateWithAlert = reducer([], addAlert('SomeAlert', 'msg'));
      const key = stateWithAlert[0].alertProps.key;
      const state = reducer(stateWithAlert, removeAlert(key));
      expect(state).toHaveLength(0);
    });

    it('does nothing if key does not exist', () => {
      const stateWithAlert = reducer([], addAlert('SomeAlert', 'msg'));
      const state = reducer(stateWithAlert, removeAlert('nonexistent-key'));
      expect(state).toHaveLength(1);
    });
  });
});
