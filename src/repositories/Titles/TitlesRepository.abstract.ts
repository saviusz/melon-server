export interface ITitlesRepository {
  getSongsIds() : Promise<Array<string>>;
  getOnSong(songId: string) : Promise<Array<string>>;
  add(songId: string, title: string) : Promise<string>;
  addMany(songId: string, titles: string[]) : Promise<string[]>;
}
