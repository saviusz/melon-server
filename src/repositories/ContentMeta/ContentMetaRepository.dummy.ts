import { ContentMetaEntity, IContentMetaRepository } from "./ContentMetaRepository.abstract";

export class DummyContentMetaRepository implements IContentMetaRepository {

  getOneBySongId(songId: string): Promise<ContentMetaEntity> {
    throw new Error("Method not implemented.");
  }

}
