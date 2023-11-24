import { Service } from "../core/Service";
import { User } from "../models/User";
import { Content } from "../models/VersionedContent";
import { IContentMetaRepository } from "../repositories/ContentMeta/ContentMetaRepository.abstract";
import { KnexContentMetaRepository } from "../repositories/ContentMeta/ContentMetaRepository.knex";
import { IPartsRepository } from "../repositories/Parts/PartsRepository.abstract";
import { FilesystemPartsRepository } from "../repositories/Parts/PartsRepository.filesystem";


export class ContentService extends Service {

  private partsRepo : IPartsRepository = new FilesystemPartsRepository();
  private metasRepo : IContentMetaRepository = new KnexContentMetaRepository();

  async getDeafultVersion(songId: string) {

    const meta = await this.metasRepo.getOneBySongId(songId);
    const parts = await this.partsRepo.getContentByFilename(meta.filename);

    return new Content(
      meta.id,
      meta.name,
      new User(meta.authorId, "placeholder"),
      parts
    );
  }

  /*   async getMetaBySong(songId: string): Promise<ContentMeta[]> {
    const response = await db("versionedContentOnSong")
      .where({ songId: songId })
      .select();

    return response.map(
      (version) => new ContentMeta(
        version.id,
        version.name,
        new User(version.versionAuthorId, "placeholder")
      )
    );
  } */

  /*   async getById(id: string): Promise<Content> {
    const response = await db("versionedContentOnSong")
      .where({ contentId: id })
      .first();

    const parts = await this.partsRepo.getContentByFilename(response.filename);

    return new Content(
      response.id,
      response.name,
      new User(response.versionAuthorId, "placeholder"),
      parts
    );
  } */

  /* getPartsFromFile(filename: string) {
    return [new Part()];
  } */

}
