import { ContentMetaEntity, IContentMetaRepository } from "./ContentMetaRepository.abstract";

export class DummyContentMetaRepository implements IContentMetaRepository {

  async getOneBySongId(songId: string): Promise<ContentMetaEntity> {
    return { id: "Random ID", songId: songId, authorId: "-----uuid1-----", filename: "name", name: "elo" };
  }

}
