import { Author } from "./Author";
import { Content } from "./Content";

export class SongMeta {

  constructor(
    public readonly songId: string,
    public readonly titles: string[],
    public readonly authors: Author[],
    public readonly textAuthors: Author[]
  ) {}

}

export class Song {

  constructor(
    public readonly id: string,
    public readonly titles: string[],
    public readonly authors: Author[],
    public readonly textAuthors: Author[],
    public readonly content: Content
  ) {}

}
