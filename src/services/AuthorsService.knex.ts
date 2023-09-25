import db from "../core/Database";
import { AuthorService } from "../interfaces/AuthorService";
import { Author } from "../models/Author";

export class AuthorKnexService implements AuthorService {
  static id = "authorsService";

  async getSongAuthors(songId: String): Promise<Author[]> {
    const response = await db("authorOnSong")
      .join("author", "author.authorId", "authorOnSong.authorId")
      .where({ songId: songId })
      .select();

    return response.map(
      (x) => new Author(x.authorId, x.name, x.surname, x.pseudonym)
    );
  }

  async getSongTextAuthors(songId: String): Promise<Author[]> {
    const response = await db("textAuthorOnSong")
      .join("author", "author.authorId", "textAuthorOnSong.authorId")
      .where({ songId: songId })
      .select();

    return response.map(
      (x) => new Author(x.authorId, x.name, x.surname, x.pseudonym)
    );
  }

  getAll(): Author[] {
    throw new Error("Method not implemented.");
  }
}
