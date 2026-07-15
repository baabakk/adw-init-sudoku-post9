declare module 'better-sqlite3' {
  import { Database as BetterDatabase, Options } from 'better-sqlite3';
  const Database: {
    new (filename: string, options?: Options): BetterDatabase;
    prototype: BetterDatabase;
  };
  export = Database;
}
