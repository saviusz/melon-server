import { DummyArtistRefsRepository } from "../repositories/ArtistRefs/ArtistRefsRepository.dummy";
import { DummyArtistsRepository } from "../repositories/Artists/ArtistsRepository.dummy";
import { DummyContentDataRepository } from "../repositories/ContentData/ContentDataRepository.dummy";
import { DummyContentMetaRepository } from "../repositories/ContentMeta/ContentMetaRepository.dummy";
import { DummyTitlesRepository } from "../repositories/Titles/TitlesRepository.dummy";
import { AuthorService } from "../services/AuthorsService";
import { ContentService } from "../services/ContentService";
import { SongService } from "../services/SongsService";


export default class ServiceContainer {

  constructor(
    readonly songService    : SongService,
    readonly authorService  : AuthorService,
    readonly contentService : ContentService
  ) {
    this.songService.injectServices(this);
    this.authorService.injectServices(this);
    this.contentService.injectServices(this);
  }

}

export const testingContainer = new ServiceContainer(
  new SongService(new DummyTitlesRepository()),
  new AuthorService(new DummyArtistsRepository(), new DummyArtistRefsRepository()),
  new ContentService(new DummyContentDataRepository(), new DummyContentMetaRepository())
);
