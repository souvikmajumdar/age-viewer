import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { addFrame, removeFrame, trimFrame } from '../features/frame/FrameSlice';

describe('FrameSlice', () => {
  let store;

  beforeEach(() => {
    vi.stubGlobal('crypto', { randomUUID: () => 'test-uuid' });
    store = configureStore({ reducer: { frames: reducer } });
  });

  it('has an empty array as initial state', () => {
    expect(store.getState().frames).toEqual([]);
  });

  describe('addFrame', () => {
    it('adds a frame to state', () => {
      store.dispatch(addFrame('SELECT * FROM test', 'CypherFrame'));
      const frames = store.getState().frames;
      expect(frames).toHaveLength(1);
      expect(frames[0].frameName).toBe('CypherFrame');
      expect(frames[0].frameProps.reqString).toBe('SELECT * FROM test');
    });

    it('trims reqString whitespace', () => {
      store.dispatch(addFrame('  SELECT 1  ', 'CypherFrame'));
      const frames = store.getState().frames;
      expect(frames[0].frameProps.reqString).toBe('SELECT 1');
    });

    it('uses refKey as key when provided', () => {
      store.dispatch(addFrame('query', 'CypherFrame', 'my-custom-key'));
      const frames = store.getState().frames;
      expect(frames[0].frameProps.key).toBe('my-custom-key');
    });

    it('generates a key via crypto.randomUUID when refKey is not provided', () => {
      store.dispatch(addFrame('query', 'CypherFrame'));
      const frames = store.getState().frames;
      expect(frames[0].frameProps.key).toBe('test-uuid');
    });

    it('detects :play commands and sets playTarget', () => {
      store.dispatch(addFrame(':play intro', 'ServerStatusFrame'));
      const frames = store.getState().frames;
      expect(frames[0].frameProps.playTarget).toBe('intro');
    });

    it('does not set playTarget for non-play commands', () => {
      store.dispatch(addFrame('MATCH (n) RETURN n', 'CypherFrame'));
      const frames = store.getState().frames;
      expect(frames[0].frameProps.playTarget).toBeUndefined();
    });

    it('sets isPinned to false for new frames', () => {
      store.dispatch(addFrame('query', 'CypherFrame'));
      const frames = store.getState().frames;
      expect(frames[0].isPinned).toBe(false);
    });
  });

  describe('removeFrame', () => {
    it('removes a frame by key', () => {
      store.dispatch(addFrame('query1', 'CypherFrame', 'key-1'));
      store.dispatch(addFrame('query2', 'CypherFrame', 'key-2'));
      store.dispatch(removeFrame('key-1'));
      const frames = store.getState().frames;
      expect(frames).toHaveLength(1);
      expect(frames[0].frameProps.key).toBe('key-2');
    });

    it('does nothing if key does not exist', () => {
      store.dispatch(addFrame('query', 'CypherFrame', 'key-1'));
      store.dispatch(removeFrame('nonexistent'));
      const frames = store.getState().frames;
      expect(frames).toHaveLength(1);
    });
  });

  describe('trimFrame', () => {
    it('removes all frames with matching frameName', () => {
      store.dispatch(addFrame('q1', 'CypherFrame', 'k1'));
      store.dispatch(addFrame('q2', 'ServerStatusFrame', 'k2'));
      store.dispatch(addFrame('q3', 'CypherFrame', 'k3'));
      store.dispatch(trimFrame('CypherFrame'));
      const frames = store.getState().frames;
      expect(frames).toHaveLength(1);
      expect(frames[0].frameName).toBe('ServerStatusFrame');
    });

    it('returns empty array when all frames match', () => {
      store.dispatch(addFrame('q1', 'CypherFrame', 'k1'));
      store.dispatch(addFrame('q2', 'CypherFrame', 'k2'));
      store.dispatch(trimFrame('CypherFrame'));
      const frames = store.getState().frames;
      expect(frames).toHaveLength(0);
    });
  });
});
