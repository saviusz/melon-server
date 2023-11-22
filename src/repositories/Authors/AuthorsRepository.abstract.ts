import { Author } from "../../models/Author";

type authorType = "author" | "textAuthor";

export interface IAuthorsRepository {
  getOneById(id: string) : Promise<Author>;
  getMultiple(): Promise<Array<Author>>;

  getOnSong(songId: string, type: authorType ) : Promise<Array<Author>>;
}
