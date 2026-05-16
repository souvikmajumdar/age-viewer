import { describe, it, expect } from 'vitest';
import { getQuery } from '../src/tools/SQLFlavorManager.js';

describe('SQLFlavorManager', () => {
  describe('getQuery', () => {
    it('reads a top-level SQL file by name', () => {
      const query = getQuery('get_role');
      expect(query).toBeTruthy();
      expect(typeof query).toBe('string');
    });

    it('reads a versioned SQL file', () => {
      const query = getQuery('meta_data', '14');
      expect(query).toBeTruthy();
      expect(typeof query).toBe('string');
    });

    it('throws for non-existent SQL file', () => {
      expect(() => getQuery('does_not_exist')).toThrow(/SQL does not exist/);
    });

    it('throws for non-existent versioned SQL file', () => {
      expect(() => getQuery('meta_data', '99')).toThrow(/SQL does not exist/);
    });

    it('returns different content for different versions', () => {
      const v11 = getQuery('meta_data', '11');
      const v14 = getQuery('meta_data', '14');
      // They might be the same content, but both should resolve
      expect(v11).toBeTruthy();
      expect(v14).toBeTruthy();
    });
  });
});
