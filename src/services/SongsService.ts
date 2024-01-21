import { randomUUID } from "crypto";

import { Service } from "../core/Service";
import NotFoundError from "../core/errors/NotFoundError";
import NotImplementedError from "../core/errors/NotImplementedError";
import { Song, SongMeta } from "../models/Song";
import { ITitlesRepository } from "../repositories/Titles/TitlesRepository.abstract";

export class SongService extends Service {

  private titlesRepo: ITitlesRepository;

  constructor(titlesRepo: ITitlesRepository) {
    super();
    this.titlesRepo = titlesRepo;
  }

  private get authorsService() {
    return this.services.authorService;
  }

  private get contentService() {
    return this.services.contentService;
  }

  async createSong(data: {
    titles        : string[];
    authorIds     : string[];
    textAuthorIds : string[];
  }): Promise<SongMeta> {


    const uuid = randomUUID();
    this.titlesRepo.addMany(uuid, data.titles);

    throw new NotImplementedError();

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

  async getSong(id: string): Promise<Song> {

    const titles = await this.titlesRepo.getOnSong(id);
    if(titles.length < 1) throw new NotFoundError(`Couldn't find song with id ${id}`);

    const authors = await this.authorsService.getOnSong(id, "author");
    const textAuthors = await this.authorsService.getOnSong(id, "textAuthor");
    const version = await this.contentService.getDeafultVersion(id);

    return new Song(id, titles, authors, textAuthors, version);
  }

}
