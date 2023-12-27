import App from "./app";
import { logger } from "./core/Logger/Logger";
import ServiceContainer from "./core/ServiceContainer";
import { KnexAuthorsRepository } from "./repositories/Authors/AuthorsRepository.knex";
import { KnexContentMetaRepository } from "./repositories/ContentMeta/ContentMetaRepository.knex";
import { FilesystemPartsRepository } from "./repositories/Parts/PartsRepository.filesystem";
import { KnexTitlesRepository } from "./repositories/Titles/TitlesRepository.knex";
import { AuthorService } from "./services/AuthorsService";
import { ContentService } from "./services/ContentService";
import { SongService } from "./services/SongsService";

const port = 3000;

const container = new ServiceContainer(
  new SongService(new KnexTitlesRepository()),
  new AuthorService(new KnexAuthorsRepository()),
  new ContentService(new FilesystemPartsRepository(), new KnexContentMetaRepository())
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
