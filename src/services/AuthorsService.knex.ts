import knex from "knex";
import db from "../core/Database";
import { AuthorService } from "../interfaces/AuthorService";
import { Author } from "../models/Author";

export class AuthorKnexService implements AuthorService {

  static id = "authorsService";

  async getSongAuthors(songId: string): Promise<Author[]> {
    const response = await db("authorOnSong")
      .join("author", "author.authorId", "authorOnSong.authorId")
      .where({ songId: songId })
      .select();

    return response.map(
      (x) => new Author(x.authorId, x.name, x.surname, x.pseudonym)
    );
  }

  async getSongTextAuthors(songId: string): Promise<Author[]> {
    const response = await db("textAuthorOnSong")
      .join("author", "author.authorId", "textAuthorOnSong.authorId")
      .where({ songId: songId })
      .select();

    return response.map(
      (x) => new Author(x.authorId, x.name, x.surname, x.pseudonym)
    );
  }

  async getAll(): Promise<Author[]> {
    const res = await db("authors").select();
    return res.map(row => new Author(row.id, row.name, row.surname, row.psudonym));
  }

  async addAuthor(name: string, pseudonym: string, surname: string) {
    const resp = await db.insert({ name, pseudonym, surname }, "*").into("author") as unknown as {
      id        : string;
      name      : string;
      pseudonym : string;
      surname   : string;
    };
    return new Author(resp.id, resp.name, resp.surname, resp.pseudonym);
  }

}
