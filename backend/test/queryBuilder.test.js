import { describe, it, expect } from 'vitest';
import QueryBuilder from '../src/models/QueryBuilder.js';

describe('QueryBuilder', () => {
  it('builds a default query with graph name', () => {
    const qb = new QueryBuilder({ graphName: 'mygraph' });
    expect(qb.getGeneratedQuery()).toContain("cypher('mygraph'");
    expect(qb.getGeneratedQuery()).toContain('as (x agtype);');
  });

  it('uses custom returnAs alias', () => {
    const qb = new QueryBuilder({ graphName: 'mygraph', returnAs: 'v' });
    expect(qb.getGeneratedQuery()).toContain('as (v agtype);');
  });

  it('inserts CREATE clause when create() is called', () => {
    const qb = new QueryBuilder({ graphName: 'mygraph' });
    qb.create();
    qb.insertQuery('(:Person {name:"Alice"})');
    const query = qb.getGeneratedQuery();
    expect(query).toContain('CREATE');
    expect(query).toContain('(:Person {name:"Alice"})');
  });

  it('joins multiple inserted queries with commas', () => {
    const qb = new QueryBuilder({ graphName: 'mygraph' });
    qb.create();
    qb.insertQuery('(:A)');
    qb.insertQuery('(:B)');
    expect(qb.getGeneratedQuery()).toContain('(:A), (:B)');
  });

  it('allows custom start query override', () => {
    const qb = new QueryBuilder({ graphName: 'mygraph' });
    qb.startQuery('CUSTOM START ');
    qb.endQuery(' CUSTOM END');
    qb.insertQuery('MIDDLE');
    expect(qb.getGeneratedQuery()).toBe('CUSTOM START MIDDLE CUSTOM END');
  });

  it('handles empty middle (no inserts)', () => {
    const qb = new QueryBuilder({ graphName: 'mygraph' });
    const query = qb.getGeneratedQuery();
    expect(query).toContain("cypher('mygraph'");
    expect(query).toContain('agtype);');
  });
});
