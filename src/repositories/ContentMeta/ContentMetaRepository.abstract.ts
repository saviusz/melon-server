export interface ContentMetaEntity {
  id       : string;
  songId   : string;
  name     : string;
  authorId : string;
  filename : string;
}


export interface IContentMetaRepository {
  getOneBySongId(songId: string) : Promise<ContentMetaEntity>;
}
