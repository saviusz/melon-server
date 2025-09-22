import { QueryFn } from "../database/initDB";
import { Result } from "../Result";

interface Props {
  id: number;
  name: string | null;
  pseudonym: string | null;
  surname: string | null;
}

type ArtistRow = {
  id: number;
  name: string | null;
  surname: string | null;
  pseudonym: string | null;
};

export type ArtistInserter = (data: Props) => Result<ArtistRow, unknown>;
export function createArtistInserter(sql: QueryFn): ArtistInserter {
  return async (data: Props): Result<ArtistRow, unknown> => {
    const response = await sql<ArtistRow>`
    INSERT INTO artists (artist_id, name, surname, pseudonym)
    VALUES (${data.id}, ${data.name}, ${data.surname}, ${data.pseudonym})
    RETURNING *;`;

    if (response.error)
      return {
        data: null,
        error: `Couldn't create Artist (${data.id}, ${data.name}, ${data.surname}, ${data.pseudonym})`,
      };

    return {
      data: response.data!.rows[0]!,
      error: null,
    };
  };
}

export type ArtistSelector = () => Result<ArtistRow[], unknown>;
export function createArtistSelector(sql: QueryFn): ArtistSelector {
  return async () => {
    const { data, error } =
      await sql<ArtistRow>`SELECT artist_id, name, surname, pseudonym FROM artists`;
    if (error || !data?.rows)
      return {
        data: null,
        error: "Couldn't select authors",
      };

    return {
      data: data?.rows,
      error: null,
    };
  };
}
