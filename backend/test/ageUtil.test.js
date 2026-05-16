import { describe, it, expect } from 'vitest';
import { toAgeProps } from '../src/util/ObjectExtras.js';

describe('object serialize', () => {
  it('serialize basic', () => {
    const serial = toAgeProps({ id: 2, name: 'hi' });
    expect(serial).toBe("{id:2, name:'hi'}");
  });
});
