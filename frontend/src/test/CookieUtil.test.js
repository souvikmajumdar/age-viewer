import { describe, it, expect, beforeEach } from 'vitest';
import { loadFromCookie, saveToCookie, loadAllFromCookie } from '../features/cookie/CookieUtil';

describe('CookieUtil', () => {
  beforeEach(() => {
    // Clear all cookies by expiring them
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.trim().split('=')[0];
      if (name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      }
    });
  });

  describe('saveToCookie', () => {
    it('sets a cookie with a string value', () => {
      saveToCookie('testKey', 'hello');
      expect(document.cookie).toContain('testKey');
    });

    it('sets a cookie with a JSON object value', () => {
      saveToCookie('objKey', { name: 'test', value: 42 });
      expect(document.cookie).toContain('objKey');
    });
  });

  describe('loadFromCookie', () => {
    it('reads a string value from cookie', () => {
      saveToCookie('strCookie', 'world');
      const result = loadFromCookie('strCookie');
      expect(result).toBe('world');
    });

    it('reads a JSON object value from cookie', () => {
      saveToCookie('jsonCookie', { foo: 'bar', num: 123 });
      const result = loadFromCookie('jsonCookie');
      expect(result).toEqual({ foo: 'bar', num: 123 });
    });

    it('returns undefined for non-existent cookie', () => {
      const result = loadFromCookie('nonexistent');
      expect(result).toBeUndefined();
    });

    it('reads an array value from cookie', () => {
      saveToCookie('arrCookie', [1, 2, 3]);
      const result = loadFromCookie('arrCookie');
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('loadAllFromCookie', () => {
    it('returns all cookies as an object', () => {
      saveToCookie('cookie1', 'value1');
      saveToCookie('cookie2', 'value2');
      const all = loadAllFromCookie();
      expect(all.cookie1).toBe('value1');
      expect(all.cookie2).toBe('value2');
    });

    it('returns empty object when no cookies exist', () => {
      const all = loadAllFromCookie();
      expect(Object.keys(all)).toHaveLength(0);
    });
  });
});
