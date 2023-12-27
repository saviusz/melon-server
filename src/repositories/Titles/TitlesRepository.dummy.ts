
import { ITitlesRepository } from "./TitlesRepository.abstract";

export class DummyTitlesRepository implements ITitlesRepository {

  constructor(
    private _titles: { id: string; title: string }[] = []
  ) {}

  async add(songId: string, title: string): Promise<string> {
    this._titles.push({ id: songId, title });
    return title;
  }

  async addMany(songId: string, titles: string[]): Promise<string[]> {
    for(const title of titles) this.add(songId, title);
    return titles;
  }

  async getSongsIds(): Promise<string[]> {
    return [ ...new Set(this._titles.map(x => x.id)) ];
  }

  async getOnSong(songId: string): Promise<string[]> {
    return this._titles.filter(x => x.id == songId).map(x => x.title);
  }

}
