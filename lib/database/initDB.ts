import { Client, QueryResult, QueryResultRow } from "pg";
import sql, { RawValue } from "sql-template-tag";
import z from "zod";
import { Result } from "../Result";
import { MelonError } from "../Error";

export const dbConfigSchema = z.object({
  host: z.hostname().nonempty(),
  port: z.number().default(5432),
  database: z.string().nonempty(),
  user: z.string().nonempty(),
  pass: z.string().nonempty(),
});

export class QueryError extends MelonError {
  override ErrorID: string = "QUERY";
}

type dbConfig = z.output<typeof dbConfigSchema>;

export type QueryFn = <T extends QueryResultRow>(
  strings: readonly string[],
  ...values: readonly unknown[]
) => Result<QueryResult<T>, unknown>;

export function initDB(config: dbConfig): QueryFn {
  const pg = new Client({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.pass,
  });

  return async <T extends QueryResultRow>(
    strings: readonly string[],
    ...values: readonly RawValue[]
  ): Result<QueryResult<T>, MelonError> => {
    const query = sql(strings, values);
    try {
      const res = await pg.query<T>(query);
      return { error: null, data: res };
    } catch (e) {
      return { error: new QueryError("Couldn't run query", e), data: null };
    }
  };
}
