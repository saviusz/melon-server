export interface ITitlesRepository {

  /**
   * Returns ids of all songs that have at least one title
   */
  getSongsIds() : Promise<Array<string>>;

  /**
   * Retruns list of titles of song
   * @param songId id of song, for whose titles we're requesting
   */
  getOnSong(songId: string) : Promise<Array<string>>;

  /**
   * Adds one title to song
   * @param songId id of song, to which we're adding title
   * @param title title, we are adding
   */
  add(songId: string, title: string) : Promise<string>;

  /**
   * Adds multiple titles to song
   * @param songId id of song, to which we're adding titles
   * @param titles array of titles we want to add
   */
  addMany(songId: string, titles: string[]) : Promise<string[]>;
}
