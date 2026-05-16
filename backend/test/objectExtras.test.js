import { describe, it, expect } from 'vitest';
import { getDelete, toAgeProps } from '../src/util/ObjectExtras.js';

describe('ObjectExtras', () => {
  describe('getDelete', () => {
    it('returns the value at the given key', () => {
      const obj = { foo: 'bar', baz: 42 };
      expect(getDelete(obj, 'foo')).toBe('bar');
    });

    it('removes the key from the object', () => {
      const obj = { foo: 'bar', baz: 42 };
      getDelete(obj, 'foo');
      expect(obj).toEqual({ baz: 42 });
    });

    it('returns undefined for non-existent key', () => {
      const obj = { foo: 'bar' };
      expect(getDelete(obj, 'missing')).toBeUndefined();
    });

    it('handles nested objects (returns reference)', () => {
      const nested = { x: 1 };
      const obj = { nested };
      const result = getDelete(obj, 'nested');
      expect(result).toBe(nested);
      expect(obj).toEqual({});
    });
  });

  describe('toAgeProps', () => {
    it('serializes a basic object', () => {
      expect(toAgeProps({ id: 2, name: 'hi' })).toBe("{id:2, name:'hi'}");
    });

    it('returns empty string for empty object by default', () => {
      expect(toAgeProps({})).toBe('');
    });

    it('returns empty braces for empty object when empty=true', () => {
      expect(toAgeProps({}, true)).toBe('{}');
    });

    it('quotes string values with single quotes', () => {
      expect(toAgeProps({ name: 'Alice' })).toBe("{name:'Alice'}");
    });

    it('does not quote numeric values', () => {
      expect(toAgeProps({ age: 30 })).toBe('{age:30}');
    });

    it('handles boolean values', () => {
      expect(toAgeProps({ active: true })).toBe('{active:true}');
    });

    it('handles multiple properties of mixed types', () => {
      const result = toAgeProps({ id: 1, name: 'Bob', active: false });
      expect(result).toBe("{id:1, name:'Bob', active:false}");
    });
  });
});
