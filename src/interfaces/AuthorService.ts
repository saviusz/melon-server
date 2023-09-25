import { Author } from "../models/Author";

export interface AuthorService {
  getSongAuthors(songId: String): Promise<Author[]>;
  getSongTextAuthors(songId: String): Promise<Author[]>;
  getAll(): Author[];
}
