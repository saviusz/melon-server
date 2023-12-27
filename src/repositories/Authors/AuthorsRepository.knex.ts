import { randomUUID } from "crypto";
import { Author } from "../../models/Author";
import { AuthorDO, CreateAuthorDO, IAuthorsRepository } from "./AuthorsRepository.abstract";
import { Knex } from "knex";
import { up } from "../../../migrations/20230911212905_init";

export class KnexAuthorsRepository implements IAuthorsRepository {

  constructor(
    private database: Knex
  ) {
    up(this.database);
  }

  getOneById(): Promise<Author> {
    throw new Error("Method not implemented.");
  }

  async getMultiple(): Promise<Author[]> {
    const rows = await this.database<AuthorDO>("author").select();
    return rows.map(x => new Author(x.authorId, x.name, x.surname, x.pseudonym));
  }

  async getOnSong(songId: string, type: "author" | "textAuthor" = "author"): Promise<Author[]> {

    const table = type == "textAuthor" ? "textAuthorOnSong" : "authorOnSong";
    const response = await this.database(table)
      .join("author", "author.authorId", `${table}.authorId`)
      .where({ songId })
      .select();

    return response.map(
      (x) => new Author(x.authorId, x.name, x.surname, x.pseudonym)
    );
  }

  async addOne(data: CreateAuthorDO): Promise<Author> {
    const uuid = randomUUID();

    const resp = await this.database<AuthorDO>("author")
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
