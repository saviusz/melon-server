import db from "../../core/Database";
import { ITitlesRepository } from "./TitlesRepository.abstract";

export class KnexTitlesRepository implements ITitlesRepository {

  async getSongsIds(): Promise<string[]> {
    const ids = await db("titleOnSong")
      .distinct("songId")
      .select("songId");
    return ids.map((x) => x.songId);
  }

  async getOnSong(songId: string): Promise<string[]> {
    const response = await db("titleOnSong").where({ songId: songId })
      .select();
    return response.map(res => res["title"]);
  }

  async add(songId:string, title: string): Promise<string> {
    const response = await db("titleOnSong")
      .insert({ songId: songId, title: title }, "title");
    return "";
  }

  async addMany(songId: string, titles: string[]): Promise<string[]> {
    const response = await db("titleOnSong")
      .insert(titles.map(title => ({ songId: songId, title: title })), "title");
    return response.map(x => x["title"]);
  }

}
