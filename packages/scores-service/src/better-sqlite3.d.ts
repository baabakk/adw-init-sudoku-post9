declare class Database {
  constructor(filename: string, options?: any);
  exec(sql: string): void;
  prepare(sql: string): any;
  // Add any other methods you need minimally for compilation.
}
export = Database;