import app from "./app";
import { logger } from "./core/Logger/Logger";

const port = 3000;


logger.debug(`Trying to run in ${process.env["NODE_ENV"]?.trim()} enviroment`);
try {
  app.listen(port, (): void => {
    logger.info(`Listening on port: ${port}`);
  });
} catch (error) {
  logger.error(`Error occured: ${error}`);
}
