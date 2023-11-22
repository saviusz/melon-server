import db from "../../core/Database";
import { Author } from "../../models/Author";
import { IAuthorsRepository } from "./AuthorsRepository.abstract";

export class KnexAuthorsRepository implements IAuthorsRepository {

  getOneById(): Promise<Author> {
    throw new Error("Method not implemented.");
  }

  getMultiple(): Promise<Author[]> {
    throw new Error("Method not implemented.");
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

}
