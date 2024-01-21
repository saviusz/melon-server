import { Knex } from "knex";

import { ITitlesRepository } from "./TitlesRepository.abstract";

export class KnexTitlesRepository implements ITitlesRepository {

  constructor(
    private database: Knex
  ) {}

  async add(songId:string, title: string): Promise<string> {
    const resp = await this.database("titleOnSong")
      .insert({ songId: songId, title: title }, "title");
    return resp[0]["title"];
  }

  async addMany(songId: string, titles: string[]): Promise<string[]> {
    const response = await this.database("titleOnSong")
      .insert(titles.map(title => ({ songId: songId, title: title })), "title");
    return response.map(x => x["title"]);
  }

  async getOnSong(songId: string): Promise<string[]> {
    const response = await this.database("titleOnSong").where({ songId: songId })
      .select();
    return response.map(res => res["title"]);
  }

  async getSongsIds(): Promise<string[]> {
    const ids = await this.database("titleOnSong")
      .distinct("songId")
      .select("songId");
    return ids.map((x) => x.songId);
  }

}
