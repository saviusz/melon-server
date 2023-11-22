import db from "../core/Database";
import { Author } from "../models/Author";

export class AuthorKnexService  {

  static id = "authorsService";

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
