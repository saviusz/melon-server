import { randomUUID } from "crypto";
import db from "../core/Database";
import { SongService } from "../interfaces/SongsService";
import { Song, SongMeta } from "../models/Song";
import { AuthorKnexService } from "./AuthorsService.knex";
import { ContentFilesystemKnexService } from "./ContentService.fs.knex";

export class SongKnexService implements SongService {

  static id = "songsService";
  authorsService = new AuthorKnexService();
  contentService = new ContentFilesystemKnexService();

  async getIds(): Promise<string[]> {
    const ids = await db("titleOnSong").distinct("songId")
      .select("songId");
    return ids.map((x) => x.songId);
  }

  async getMeta(id: string): Promise<SongMeta> {
    const titles = await this.getSongTitles(id);
    const authors = await this.authorsService.getSongAuthors(id);
    const textAuthors = await this.authorsService.getSongTextAuthors(id);

    return new SongMeta(id, titles, authors, textAuthors);
  }

  getMetaList(): SongMeta[] {
    return [];
  }

  async getSongTitles(id: string): Promise<string[]> {
    const titlesResponse = await db("titleOnSong")
      .where({ songId: id })
      .select("title");
    // if (titlesResponse.length <= 0) throw new NotFoundError("song", id);
    return titlesResponse.map((x) => x.title);
  }

  async getSong(id: string): Promise<Song> {
    const titles = await this.getSongTitles(id);
    const authors = await this.authorsService.getSongAuthors(id);
    const textAuthors = await this.authorsService.getSongTextAuthors(id);
    const version = await this.contentService.getDeafultVersion(id);

    return new Song(id, titles, authors, textAuthors, version);
  }

  async createSong(data: {
    titles        : string[];
    authorIds     : string[];
    textAuthorIds : string[];
  }): Promise<SongMeta> {

    const uuid = randomUUID();
    await db.transaction(async () : Promise<void> => {
      for await (const title of data.titles) await db("titleOnSong")
        .insert({ songId: uuid, title: title });
    });

    return this.getMeta(uuid);
  }

}
