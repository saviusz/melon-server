/** Artist datasource object */
export interface ArtistDO {
  authorId  : string;
  name      : string | null;
  pseudonym : string | null;
  surname   : string | null;
}

/** Artist creational datasource object */
export type CreateArtistDO = Omit<Partial<ArtistDO>, "authorId">;

export interface IArtistsRepository {

  /**
   * Creates new artist in datasource
   * @param artist Data of artist, that gonna be created
   */
  create(artist: CreateArtistDO): Promise<ArtistDO>;

  /**
   * Gets artist info from datasource
   * @param id id of artist we're looking for
   * @returns author with id
   */
  getOneById(id: string): Promise<ArtistDO>;

  /** Returns list of all artists in database */
  getMultiple(params?: { ids?: string[] }): Promise<Array<ArtistDO>>;
}
