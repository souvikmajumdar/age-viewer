interface QueryEnds {
  start: string;
  end: string;
}

interface QueryBuilderOptions {
  graphName: string;
  returnAs?: string;
}

class QueryBuilder {
  private _graphName: string;
  private ends: QueryEnds;
  public clause: string;
  private middle: string[];

  constructor({ graphName, returnAs = 'x' }: QueryBuilderOptions = { graphName: '' }) {
    this._graphName = graphName;
    this.ends = {
      start: `SELECT * FROM cypher('${this._graphName}', $$`,
      end: `$$) as (${returnAs} agtype);`,
    };
    this.clause = '';
    this.middle = [];
  }

  startQuery(startQuery: string): void {
    this.ends.start = startQuery;
  }

  insertQuery(clause: string): void {
    this.middle.push(clause);
  }

  create(): void {
    this.clause = 'CREATE ';
  }

  endQuery(endQuery: string): void {
    this.ends.end = endQuery;
  }

  getGeneratedQuery(): string {
    return (
      this.ends.start +
      this.clause +
      this.middle.join(', ') +
      this.ends.end
    ).trim();
  }
}

export default QueryBuilder;
