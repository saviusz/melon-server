import { QueryFn } from "../database/initDB";
import { Result } from "../Result";

interface Props {
  id: string;
  name: string | null;
  pseudonym: string | null;
  surname: string | null;
}

export type AuthorInserter = (data: Props) => Result<AuthorRow, unknown>;
type AuthorRow = {
  id: string;
  name: string | null;
  surname: string | null;
  pseudonym: string | null;
};

export function createAuthorInserter(sql: QueryFn): AuthorInserter {
  return async (data: Props): Result<AuthorRow, unknown> => {
    const response = await sql<AuthorRow>`
    INSERT INTO authors (author_id, name, surname, pseudonym)
    VALUES (${data.id}, ${data.name}, ${data.surname}, ${data.pseudonym})
    RETURNING *;`;

    if (response.error)
      return {
        data: null,
        error: `Couldn't create Author (${data.id}, ${data.name}, ${data.surname}, ${data.pseudonym})`,
      };

    return {
      data: response.data!.rows[0]!,
      error: null,
    };
  };
}
