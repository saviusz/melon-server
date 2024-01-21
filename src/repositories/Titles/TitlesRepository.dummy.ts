import { ITitlesRepository } from "./TitlesRepository.abstract";

export class DummyTitlesRepository implements ITitlesRepository {

  constructor(
    private _titles: { [key: string]: string[] } = {}
  ) {}

  async add(songId: string, title: string): Promise<string> {
    const titles = this._titles[songId] ?? [];
    this._titles[songId] = [ ...titles, title ];
    return title;
  }

  async addMany(songId: string, titles: string[]): Promise<string[]> {
    for(const title of titles) this.add(songId, title);
    return titles;
  }

  async getOnSong(songId: string): Promise<string[]> {
    return this._titles[songId] ?? [];
  }

  async getSongsIds(): Promise<string[]> {
    return Object.keys(this._titles);
  }

}
