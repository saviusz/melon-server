import { Author } from "../../models/Author";
import { CreateAuthorDO, IAuthorsRepository } from "./AuthorsRepository.abstract";

export class DummyAuthorsRepository implements IAuthorsRepository {

  constructor(
    private _authors: Author[] = [],
    private _authorsOnSong: { songId: string; author: Author }[] = [],
    private _textAuthorsOnSong: { songId: string; author: Author }[] = []
  ) {}

  async getOneById(id: string): Promise<Author> {
    const key = this._authors.find(x => x.id == id);
    if (key != undefined) return key;
    throw new Error("Cannot find author with id " + id);
  }

  async getMultiple(): Promise<Author[]> {
    return this._authors;
  }

  async getOnSong(songId: string, type: "author" | "textAuthor"): Promise<Author[]> {
    if(type == "author") return this._authorsOnSong
      .filter(x => x.songId == songId)
      .map(x => x.author);
    else if(type == "textAuthor") return this._textAuthorsOnSong
      .filter(x => x.songId == songId)
      .map(x => x.author);
    throw new Error("Unreachable");
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
