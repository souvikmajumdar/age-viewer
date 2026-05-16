import { describe, it, expect, beforeEach } from 'vitest';
import sessionService from '../src/services/sessionService.js';

describe('SessionService', () => {
  beforeEach(() => {
    // Reset internal map by clearing all known keys
    // Since sessionService is a singleton, we use unique keys per test
  });

  describe('put and get', () => {
    it('stores and retrieves a session value', () => {
      sessionService.put('session-1', { db: 'test' });
      expect(sessionService.get('session-1')).toEqual({ db: 'test' });
    });

    it('returns null for non-existent session', () => {
      expect(sessionService.get('non-existent-key-xyz')).toBeNull();
    });

    it('overwrites existing session value', () => {
      sessionService.put('session-2', 'first');
      sessionService.put('session-2', 'second');
      expect(sessionService.get('session-2')).toBe('second');
    });

    it('handles complex objects', () => {
      const obj = { nested: { value: 42 }, array: [1, 2, 3] };
      sessionService.put('session-3', obj);
      expect(sessionService.get('session-3')).toEqual(obj);
    });

    it('isolates sessions by key', () => {
      sessionService.put('session-a', 'A');
      sessionService.put('session-b', 'B');
      expect(sessionService.get('session-a')).toBe('A');
      expect(sessionService.get('session-b')).toBe('B');
    });
  });
});
