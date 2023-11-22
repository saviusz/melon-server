import { randomUUID } from "crypto";
import db from "../../core/Database";
import { Author } from "../../models/Author";
import { AuthorDO, CreateAuthorDO, IAuthorsRepository } from "./AuthorsRepository.abstract";

export class KnexAuthorsRepository implements IAuthorsRepository {

  getOneById(): Promise<Author> {
    throw new Error("Method not implemented.");
  }

  async getMultiple(): Promise<Author[]> {
    const rows = await db<AuthorDO>("author").select();
    return rows.map(x => new Author(x.authorId, x.name, x.surname, x.pseudonym));
  }

  async getOnSong(songId: string, type: "author" | "textAuthor" = "author"): Promise<Author[]> {

    const table = type == "textAuthor" ? "textAuthorOnSong" : "authorOnSong";
    const response = await db(table)
      .join("author", "author.authorId", `${table}.authorId`)
      .where({ songId })
      .select();

    return response.map(
      (x) => new Author(x.authorId, x.name, x.surname, x.pseudonym)
    );
  }

  async addOne(data: CreateAuthorDO): Promise<Author> {
    const uuid = randomUUID();

    const resp = await db<AuthorDO>("author")
      .insert({ authorId: uuid, name: data.name, pseudonym: data.pseudonym, surname: data.surname })
      .returning("*");

    return new Author(
      resp[0].authorId,
      resp[0].name,
      resp[0].surname,
      resp[0].pseudonym
    );


  }

}
