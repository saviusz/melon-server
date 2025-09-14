import z, { ZodSafeParseResult } from "zod";
import { Result } from "../../Result";
import { Author } from "./Author";
import { AuthorInserter } from "../../drivers/authors";
import { generateId } from "../../genID";

export const createAuthorSchema = z
  .object({
    name: z.string().nonempty().nullish(),
    pseudonym: z.string().nonempty().nullish(),
    surname: z.string().nonempty().nullish(),
  })
  .refine(({ name, surname, pseudonym }) => {
    return !(!name && !surname && !pseudonym);
  });

type CreateAuthorProps = z.input<typeof createAuthorSchema>;

export async function createAuthor(
  data: CreateAuthorProps,
  insertAuthor: AuthorInserter,
): Result<Author, any> {
  const parseResult: ZodSafeParseResult<CreateAuthorProps> =
    createAuthorSchema.safeParse(data);
  if (!parseResult.success)
    return {
      error: parseResult.error,
      data: null,
    };

  const { data: author } = parseResult;

  const id = generateId();

  const insertRes = await insertAuthor({
    id,
    name: author.name ?? null,
    pseudonym: author.pseudonym ?? null,
    surname: author.surname ?? null,
  });

  if (insertRes.error != null || insertRes.data == null)
    return {
      error: "Couldn't insert Author to db",
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
