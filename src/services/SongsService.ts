import { randomUUID } from "crypto";

import { Service } from "../core/Service";
import NotFoundError from "../core/errors/NotFoundError";
import UnprocessableEntityError from "../core/errors/UnprocessableEntityError";
import { Song, SongMeta } from "../models/Song";
import { ITitlesRepository } from "../repositories/Titles/TitlesRepository.abstract";

export class SongService extends Service {

  private titlesRepo: ITitlesRepository;

  constructor(titlesRepo: ITitlesRepository) {
    super();
    this.titlesRepo = titlesRepo;
  }

  private get artistsService() {
    return this.services.authorService;
  }

  private get contentService() {
    return this.services.contentService;
  }

  async createSong(data: {
    titles        : string[] | undefined;
    authorIds     : string[];
    textAuthorIds : string[];
  }): Promise<SongMeta> {

    const titles = [ ...data.titles ?? [] ].map(x => x.trim()).filter(x => x.length > 0);

    const isTitlesEmpty = titles.length <= 0;
    if (isTitlesEmpty) throw new UnprocessableEntityError("Missing prop", [
      {
        code    : "Missing prop",
        detail  : "Missing at least one title",
        pointer : "#/titles"
      }
    ]);


    // Validate authors
    const authorIds = [ ...data.authorIds ?? [] ]
      .map(x => x.trim())
      .filter((x, i, array) => {
        if (array.includes(x, i + 1)) return false;
        return x.length > 0;
      });
    const foundAuthors = await this.artistsService.getMultipleByIds(authorIds);
    const foundAuthorIds = foundAuthors.map(x => x.id);
    const missingAuthors = authorIds.filter(x => !foundAuthorIds.includes(x));


    // Validate performaers
    const performerIds = [ ...data.textAuthorIds ?? [] ]
      .map(x => x.trim())
      .filter((x, i, array) => {
        if (array.includes(x, i + 1)) return false;
        return x.length > 0;
      });
    const foundPerformers = await this.artistsService.getMultipleByIds(performerIds);
    const foundPerformerIds = foundPerformers.map(x => x.id);
    const missingPerformers = performerIds.filter(x => !foundPerformerIds.includes(x));

    // Throw errors with authors and perforemrs
    if (missingAuthors.length > 0 || missingPerformers.length > 0) {
      throw new UnprocessableEntityError("Validation failed", [
        ...missingAuthors.length > 0
          ? [
              {
                code    : "Invalid id",
                detail  : `Authors with ids ${missingAuthors} does not exist`,
                pointer : "#/textAuthors"
              }
            ]
          : [],
        ...missingPerformers.length > 0
          ? [
              {
                code    : "Invalid id",
                detail  : `Authors with ids ${missingPerformers} does not exist`,
                pointer : "#/authors"
              }
            ]
          : [],
      ]);
    }


    const uuid = randomUUID();

    const _titles = await this.titlesRepo.addMany(uuid, titles);

    return new SongMeta(
      uuid,
      _titles,
      foundAuthors,
      foundPerformers
    );
  }

  async getIds(): Promise<string[]> {
    return this.titlesRepo.getSongsIds();
  }

  async getMeta(id: string): Promise<SongMeta> {
    const titles = await this.titlesRepo.getOnSong(id);

    const authors = await this.artistsService.getOnSong(id, "author");
    const textAuthors = await this.artistsService.getOnSong(id, "textAuthor");

    return new SongMeta(id, titles, authors, textAuthors);
  }

  async getSong(id: string): Promise<Song> {

    const titles = await this.titlesRepo.getOnSong(id);
    if(titles.length < 1) throw new NotFoundError(`Couldn't find song with id ${id}`);

    const authors = await this.artistsService.getOnSong(id, "author");
    const textAuthors = await this.artistsService.getOnSong(id, "textAuthor");
    const version = await this.contentService.getDeafultVersion(id);

    return new Song(id, titles, authors, textAuthors, version);
  }

}
