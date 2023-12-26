import App from "./app";
import { logger } from "./core/Logger/Logger";
import ServiceContainer from "./core/ServiceContainer";
import { KnexArtistsRepository } from "./repositories/Artists/ArtistsRepository.knex";
import { KnexContentMetaRepository } from "./repositories/ContentMeta/ContentMetaRepository.knex";
import { FilesystemPartsRepository } from "./repositories/Parts/PartsRepository.filesystem";
import { KnexTitlesRepository } from "./repositories/Titles/TitlesRepository.knex";
import { AuthorService } from "./services/AuthorsService";
import { ContentService } from "./services/ContentService";
import { SongService } from "./services/SongsService";
import Knex from "knex";
import knexfile from "../knexfile";
import { KnexArtistRefsRepository } from "./repositories/ArtistRefs/ArtistRefsRepository.knex";

const port = 3000;

const database = Knex(knexfile[(process.env["NODE_ENV"] || "test").trim()]);

const container = new ServiceContainer(
  new SongService(new KnexTitlesRepository(database)),
  new AuthorService(new KnexArtistsRepository(database), new KnexArtistRefsRepository(database)),
  new ContentService(new FilesystemPartsRepository(), new KnexContentMetaRepository(database))
);

const app = new App(container);

logger.debug(`Trying to run in ${process.env["NODE_ENV"]?.trim()} enviroment`);
try {
  app.start(port, (): void => {
    logger.info(`Listening on port: ${port}`);
  });
} catch (error) {
  logger.error(`Error occured: ${error}`);
}
