/** Artist datasource object */
export interface ArtistDO {
  artistId  : string;
  name      : string;
  pseudonym : string;
  surname   : string;
}

/** Artist creational datasource object */
export type CreateArtistDO = Omit<Partial<ArtistDO>, "authorId">;

export interface IArtistsRepository {

  /**
   * Creates new artist in datasource
   * @param artist Data of artist, that gonna be created
   */
  create(artist: CreateArtistDO) : Promise<ArtistDO>;


  /**
   * Gets artist info from datasource
   * @param id id of artist we're looking for
   * @returns author with id
   */
  getOneById(id: string) : Promise<ArtistDO>;

  /** Returns list of all artists in database */
  getMultiple(): Promise<Array<ArtistDO>>;
}
