import { Author } from "./Author";
import { VersionedContent } from "./VersionedContent";

export class SongMeta {
  constructor(
    public readonly songId: String,
    public readonly titles: String[],
    public readonly authors: Author[],
    public readonly textAuthors: Author[]
  ) {}
}

export class Song {
  constructor(
    public readonly id: String,
    public readonly titles: String[],
    public readonly authors: Author[],
    public readonly textAuthors: Author[],
    public readonly content: VersionedContent
  ) {}
}
