import ServiceContainer from "../../src/core/ServiceContainer";
import { IArtistRefsRepository } from "../../src/repositories/ArtistRefs/ArtistRefsRepository.abstract";
import { DummyArtistRefsRepository } from "../../src/repositories/ArtistRefs/ArtistRefsRepository.dummy";
import { IArtistsRepository } from "../../src/repositories/Artists/ArtistsRepository.abstract";
import { IContentDataRepository } from "../../src/repositories/ContentData/ContentDataRepository.abstract";
import { DummyContentDataRepository } from "../../src/repositories/ContentData/ContentDataRepository.dummy";
import { IContentMetaRepository } from "../../src/repositories/ContentMeta/ContentMetaRepository.abstract";
import { DummyContentMetaRepository } from "../../src/repositories/ContentMeta/ContentMetaRepository.dummy";
import { ITitlesRepository } from "../../src/repositories/Titles/TitlesRepository.abstract";
import { DummyTitlesRepository } from "../../src/repositories/Titles/TitlesRepository.dummy";
import { AuthorService } from "../../src/services/AuthorsService";
import { ContentService } from "../../src/services/ContentService";
import { SongService } from "../../src/services/SongsService";
import { emptyArtistsRepo } from "./artists";

export interface FilledContainerRepos {
  artistRepo      : IArtistsRepository;
  artistRefsRepo  : IArtistRefsRepository;
  contentMetaRepo : IContentMetaRepository;
  contentDataRepo : IContentDataRepository;
  titlesRepo      : ITitlesRepository;
}

const filledContainer = (repos: FilledContainerRepos) =>
  new ServiceContainer({
    authorService  : new AuthorService(repos.artistRepo, repos.artistRefsRepo),
    contentService : new ContentService(
      repos.contentDataRepo,
      repos.contentMetaRepo
    ),
    songService: new SongService(repos.titlesRepo),
  });

export const partialContainer = (repos: Partial<FilledContainerRepos>) => {
  const _repos: FilledContainerRepos = {
    artistRefsRepo  : repos.artistRefsRepo ?? new DummyArtistRefsRepository(),
    artistRepo      : repos.artistRepo ?? emptyArtistsRepo(),
    contentDataRepo : repos.contentDataRepo ?? new DummyContentDataRepository(),
    contentMetaRepo : repos.contentMetaRepo ?? new DummyContentMetaRepository(),
    titlesRepo      : repos.titlesRepo ?? new DummyTitlesRepository(),
  };

  return filledContainer(_repos);
};

export const emptyContainer = () => partialContainer({});
