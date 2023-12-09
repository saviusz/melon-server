import { Author } from "../../models/Author";
import { CreateAuthorDO, IAuthorsRepository } from "./AuthorsRepository.abstract";

export class DummyAuthorsRepository implements IAuthorsRepository {

  constructor(
    private _authors: Author[] = []
  ) {}

  async getOneById(id: string): Promise<Author> {
    const key = this._authors.find(x => x.id == id);
    if (key != undefined) return key;
    throw new Error("Cannot find author with id " + id);
  }

  async getMultiple(): Promise<Author[]> {
    return this._authors;
  }

  getOnSong(songId: string, type: "author" | "textAuthor"): Promise<Author[]> {
    throw new Error("Method not implemented.");
  }

  async addOne(data: CreateAuthorDO): Promise<Author> {
    return new Author(
      "id",
      data.name,
      data.surname,
      data.pseudonym
    );
  }

}
