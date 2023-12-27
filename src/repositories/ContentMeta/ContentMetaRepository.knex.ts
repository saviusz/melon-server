import db from "../../core/Database";
import NotFoundError from "../../core/errors/NotFoundError";
import { ContentMetaEntity, IContentMetaRepository } from "./ContentMetaRepository.abstract";

export class KnexContentMetaRepository implements IContentMetaRepository {

  async getOneBySongId(songId: string): Promise<ContentMetaEntity> {
    const response = await db("versionedContentOnSong")
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
