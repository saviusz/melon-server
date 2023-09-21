import { SongService } from "../interfaces/SongsService";
import { SongMeta } from "../models/Song";
import db from "../core/Database";

export class SongKnexService implements SongService {
  async getIds(): Promise<string[]> {
    const ids = await db("titleOnSong").distinct("songId").select("songId");
    return ids.map((x) => x.songId);
  }

  getMeta(id: string): Promise<SongMeta> {
    throw new Error("Method not implemented.");
  }

  getMetaList(): SongMeta[] {
    return [];
  }

  /*   getMeta(id: string): SongMeta {
    const titles = this.getSongTitles(id);
    return new SongMeta(id, titles, authors, textAuthors);
  } */

  async getSongTitles(id: string): Promise<string[]> {
    const titlesResponse = await db("titleOnSong")
      .where({ songId: id })
      .select("title");

    return titlesResponse.map((x) => x.title);
  }
}
