import { randomUUID } from "crypto";
import { Song, SongMeta } from "../models/Song";
import { ITitlesRepository } from "../repositories/Titles/TitlesRepository.abstract";
import NotImplementedError from "../core/errors/NotImplementedError";
import { Service } from "../core/Service";

export class SongService extends Service {

  private titlesRepo: ITitlesRepository;

  constructor(titlesRepo: ITitlesRepository) {
    super();
    this.titlesRepo = titlesRepo;
  }

  private get contentService() {
    return this.services.contentService;
  }

  private get authorsService() {
    return this.services.authorService;
  }

  async getIds(): Promise<string[]> {
    return this.titlesRepo.getSongsIds();
  }

  async getMeta(id: string): Promise<SongMeta> {
    const titles = await this.titlesRepo.getOnSong(id);

    const authors = await this.authorsService.getOnSong(id, "author");
    const textAuthors = await this.authorsService.getOnSong(id, "textAuthor");

    return new SongMeta(id, titles, authors, textAuthors);
  }

  getMetaList(): SongMeta[] {
    return [];
  }


  async getSong(id: string): Promise<Song> {

    const titles = await this.titlesRepo.getOnSong(id);

    const authors = await this.authorsService.getOnSong(id, "author");
    const textAuthors = await this.authorsService.getOnSong(id, "textAuthor");
    const version = await this.contentService.getDeafultVersion(id);

    return new Song(id, titles, authors, textAuthors, version);
  }

  async createSong(data: {
    titles        : string[];
    authorIds     : string[];
    textAuthorIds : string[];
  }): Promise<SongMeta> {


    const uuid = randomUUID();
    this.titlesRepo.addMany(uuid, data.titles);

    throw new NotImplementedError();

    /* await db.transaction(async () : Promise<void> => {
      for await (const title of data.titles) await db("titleOnSong")
        .insert({ songId: uuid, title: title });
     });*/

    return this.getMeta(uuid);
  }

}
