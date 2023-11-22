import { ContentMetaEntity } from "../../entities/ContentMeta";


export interface IContentMetaRepository {
  getOneBySongId(songId: string) : Promise<ContentMetaEntity>;
}
