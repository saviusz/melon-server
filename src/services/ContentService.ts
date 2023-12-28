import { Service } from "../core/Service";
import { User } from "../models/User";
import { Content } from "../models/Content";
import { IContentMetaRepository } from "../repositories/ContentMeta/ContentMetaRepository.abstract";
import { IContentDataRepository } from "../repositories/ContentData/ContentDataRepository.abstract";


export class ContentService extends Service {

  private partsRepo : IContentDataRepository;
  private metasRepo : IContentMetaRepository;

  constructor(partsRepo: IContentDataRepository, metasRepo: IContentMetaRepository) {
    super();
    this.partsRepo = partsRepo;
    this.metasRepo = metasRepo;
  }

  async getDeafultVersion(songId: string) {

    const meta = await this.metasRepo.getOneBySongId(songId);
    const parts = await this.partsRepo.readContent(meta.filename);

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
