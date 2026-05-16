import { describe, it, expect } from 'vitest';
import { AGTypeParse } from '../src/tools/AGEParser.js';

describe('Test Connector Api', () => {
  it('Object Circulating', () => {
    const ret = AGTypeParse('{"id": 1688849860263937, "label": "car", "properties": {"a": {"b":{"c":{"d":[1, 2, "A"]}}}}}::vertex');
    expect(ret).toStrictEqual({
      id: 1688849860263937,
      label: 'car',
      properties: {
        a: { b: { c: { d: [1, 2, 'A'] } } },
      },
    });
  });

  it('Null Properties', () => {
    const ret = AGTypeParse('{"id": 1688849860263937, "label": "car", "properties": {}}::vertex');
    expect(ret).toStrictEqual({ id: 1688849860263937, label: 'car', properties: {} });
  });

  it('Path', () => {
    const ret = AGTypeParse('[{"id": 844424930131969, "label": "Part", "properties": {"part_num": "123"}}::vertex, {"id": 1125899906842625, "label": "used_by", "end_id": 844424930131970, "start_id": 844424930131969, "properties": {"quantity": 1}}::edge, {"id": 844424930131970, "label": "Part", "properties": {"part_num": "345"}}::vertex]::path');
    expect(ret).toStrictEqual([
      { id: 844424930131969, label: 'Part', properties: { part_num: '123' } },
      { id: 1125899906842625, label: 'used_by', end_id: 844424930131970, start_id: 844424930131969, properties: { quantity: 1 } },
      { id: 844424930131970, label: 'Part', properties: { part_num: '345' } },
    ]);
  });

  it('Edge', () => {
    const ret = AGTypeParse('{"id": 1125899906842625, "label": "used_by", "end_id": 844424930131970, "start_id": 844424930131969, "properties": {"quantity": 1}}::edge');
    expect(ret).toStrictEqual({
      id: 1125899906842625,
      label: 'used_by',
      end_id: 844424930131970,
      start_id: 844424930131969,
      properties: { quantity: 1 },
    });
  });

  it('String', () => {
    const ret = AGTypeParse('"parent"');
    expect(ret).toBe('parent');
  });
});
