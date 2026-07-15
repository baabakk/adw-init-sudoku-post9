declare module 'better-sqlite3' {
  export default class Database {
    constructor(filename: string, options?: any);
    exec(sql: string): void;
    prepare(sql: string): any;
    // Additional methods can be typed as any for flexibility.
  }
}
