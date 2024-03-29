import Knex from "knex";

import knexfile from "../knexfile";
import App from "./app";
import { logger } from "./core/Logger/Logger";
import ServiceContainer from "./core/ServiceContainer";
import { KnexArtistRefsRepository } from "./repositories/ArtistRefs/ArtistRefsRepository.knex";
import { KnexArtistsRepository } from "./repositories/Artists/ArtistsRepository.knex";
import { FilesystemContentDataRepository } from "./repositories/ContentData/ContentDataRepository.filesystem";
import { KnexContentMetaRepository } from "./repositories/ContentMeta/ContentMetaRepository.knex";
import { KnexTitlesRepository } from "./repositories/Titles/TitlesRepository.knex";
import { AuthorService } from "./services/AuthorsService";
import { ContentService } from "./services/ContentService";
import { SongService } from "./services/SongsService";

const port = 3000;

const database = Knex(knexfile[(process.env["NODE_ENV"] || "test").trim()]);

const container = new ServiceContainer({
  songService   : new SongService(new KnexTitlesRepository(database)),
  authorService : new AuthorService(
    new KnexArtistsRepository(database),
    new KnexArtistRefsRepository(database)
  ),
  contentService: new ContentService(
    new FilesystemContentDataRepository("./data/songs"),
    new KnexContentMetaRepository(database)
  ),
});

const app = new App(container);

logger.debug(`Trying to run in ${process.env["NODE_ENV"]?.trim()} enviroment`);
try {
  app.start(port, (): void => {
    logger.info(`Listening on port: ${port}`);
  });
} catch (error) {
  logger.error(`Error occured: ${error}`);
}
