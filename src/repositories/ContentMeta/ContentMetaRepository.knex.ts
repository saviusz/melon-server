import { Knex } from "knex";
import NotFoundError from "../../core/errors/NotFoundError";
import { ContentMetaEntity, IContentMetaRepository } from "./ContentMetaRepository.abstract";

export class KnexContentMetaRepository implements IContentMetaRepository {

  constructor(
    private database : Knex
  ) {
  }


  async getOneBySongId(songId: string): Promise<ContentMetaEntity> {
    const response = await this.database("versionedContentOnSong")
      .where({ songId: songId })
      .first();

    if (!response) throw new NotFoundError("There is no content with this songId" );

    return {
      id       : response["contentId"],
      songId   : response["songId"],
      name     : response["name"],
      authorId : response["versionAuthorId"],
      filename : response["filename"]
    };
  }

}
