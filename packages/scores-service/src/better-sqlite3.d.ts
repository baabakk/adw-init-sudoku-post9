declare module 'better-sqlite3' {
  /** Minimal type definitions for better-sqlite3 used by ScoresService */
  class Database {
    constructor(filename: string);
    exec(sql: string): void;
    prepare(sql: string): Statement;
  }

  interface Statement {
    run(...params: any[]): any;
    all(...params: any[]): any;
  }

  export default Database;
}
