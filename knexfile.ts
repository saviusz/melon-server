import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client           : "better-sqlite3",
    connection       : { filename: "./data/db.sqlite" },
    useNullAsDefault : true,
  },
  test: {
    client     : "better-sqlite3",
    connection : { filename: ":memory:" },
  },
};

export default config;
