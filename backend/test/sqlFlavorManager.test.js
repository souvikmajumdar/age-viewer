import { describe, it, expect } from 'vitest';
import { getQuery, SUPPORTED_VERSIONS, MIN_SUPPORTED_VERSION, MAX_SUPPORTED_VERSION } from '../src/tools/SQLFlavorManager.js';

describe('SQLFlavorManager', () => {
  describe('getQuery', () => {
    it('reads a top-level SQL file by name', () => {
      const query = getQuery('get_role');
      expect(query).toBeTruthy();
      expect(typeof query).toBe('string');
    });

    it('reads a versioned SQL file for supported version', () => {
      const query = getQuery('meta_data', '15');
      expect(query).toBeTruthy();
      expect(typeof query).toBe('string');
    });

    it('reads SQL for PG 16', () => {
      const query = getQuery('meta_data', '16');
      expect(query).toBeTruthy();
    });

    it('reads SQL for PG 17', () => {
      const query = getQuery('meta_data', '17');
      expect(query).toBeTruthy();
    });

    it('reads SQL for PG 18', () => {
      const query = getQuery('meta_data', '18');
      expect(query).toBeTruthy();
    });

    it('throws for EOL version (PG 11)', () => {
      expect(() => getQuery('meta_data', '11')).toThrow(/no longer supported/);
    });

    it('throws for EOL version (PG 13)', () => {
      expect(() => getQuery('meta_data', '13')).toThrow(/no longer supported/);
    });

    it('throws for unsupported future version', () => {
      expect(() => getQuery('meta_data', '99')).toThrow(/not yet supported/);
    });

    it('throws for non-existent SQL file', () => {
      expect(() => getQuery('does_not_exist')).toThrow(/SQL file not found/);
    });

    it('exports supported version constants', () => {
      expect(SUPPORTED_VERSIONS).toContain('14');
      expect(SUPPORTED_VERSIONS).toContain('18');
      expect(MIN_SUPPORTED_VERSION).toBe(14);
      expect(MAX_SUPPORTED_VERSION).toBe(18);
    });
  });
});
