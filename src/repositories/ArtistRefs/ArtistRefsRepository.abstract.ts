export interface IArtistRefsRepository {

  /**
   * Assigns author to song
   * @param songId Id of song wrote by the author
   * @param authorId Id of song author
   */
  addAuthorRef(songId: string, authorId: string) : Promise<boolean>;

  /**
   * Assigns performer to song
   * @param songId Id of song performed by the author
   * @param authorId Id of song performer
   */
  addPerformerRef(songId: string, authorId: string) : Promise<boolean>;

  /**
   * Returns list of author ids of song
   * @param songId Id of song
   */
  getAuthorsOnSong(songId: string) : Promise<string[]>;

  /**
   * Returns list of performer ids of song
   * @param songId Id of song
   */
  getPerformersOnSong(songId: string) : Promise<string[]>;
}
