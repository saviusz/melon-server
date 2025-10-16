import z, { ZodSafeParseResult } from "zod";
import { Result } from "../../Result";
import { Artist } from "./Artist";
import { ArtistInserter } from "../../drivers/artists";
import { generateId } from "../../genID";

export const createArtistSchema = z
  .object({
    name: z.string().nonempty().nullish(),
    pseudonym: z.string().nonempty().nullish(),
    surname: z.string().nonempty().nullish(),
  })
  .refine(({ name, surname, pseudonym }) => {
    return !(!name && !surname && !pseudonym);
  });

type CreateArtistProps = z.input<typeof createArtistSchema>;

export async function createArtist(
  data: CreateArtistProps,
  insertArtist: ArtistInserter,
): Result<Artist, any> {
  const parseResult: ZodSafeParseResult<CreateArtistProps> =
    createArtistSchema.safeParse(data);
  if (!parseResult.success)
    return {
      error: parseResult.error,
      data: null,
    };

  const { data: artist } = parseResult;

  const id = generateId();

  const insertRes = await insertArtist({
    id,
    name: artist.name ?? null,
    pseudonym: artist.pseudonym ?? null,
    surname: artist.surname ?? null,
  });

  if (insertRes.error != null || insertRes.data == null)
    return {
      error: "Couldn't insert Artist to db",
      data: null,
    };

  return {
    error: null,
    data: {
      name: insertRes.data.name,
      surname: insertRes.data.surname,
      pseudonym: insertRes.data.pseudonym,
      id: String(insertRes.data.id),
    },
  };
}
