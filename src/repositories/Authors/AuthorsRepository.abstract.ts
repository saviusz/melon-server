import { Author } from "../../models/Author";

type authorType = "author" | "textAuthor";

export interface AuthorDO {
  authorId  : string;
  name      : string;
  pseudonym : string;
  surname   : string;
}
export type CreateAuthorDO = Omit<Partial<AuthorDO>, "authorId">;

export interface IAuthorsRepository {
  getOneById(id: string) : Promise<Author>;
  getMultiple(): Promise<Array<Author>>;

  getOnSong(songId: string, type: authorType ) : Promise<Array<Author>>;

  addOne(data: CreateAuthorDO) : Promise<Author>;
}
