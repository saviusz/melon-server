import { Author } from "../models/Author";

export interface AuthorService {
  getSongAuthors(songId: string): Promise<Author[]>;
  getSongTextAuthors(songId: string): Promise<Author[]>;
  getAll(): Author[];
}
