export interface ContentMetaEntity {
  id       : string;
  songId   : string;
  name     : string;
  authorId : string;
  filename : string;
}


export interface IContentMetaRepository {

  /**
   * Returns default content meta for song
   * @param songId id of song whose default ContentMeta we want to get
   */
  getOneBySongId(songId: string) : Promise<ContentMetaEntity>;
}
