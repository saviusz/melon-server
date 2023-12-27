import express from "express";
import "express-async-errors";
import { SongsController } from "./controllers/songsController";
import { RootController } from "./controllers/rootController";
import ServiceContainer from "./core/ServiceContainer";
import { errorHandler } from "./middleware/error";
import { AuthorsController } from "./controllers/authorsController";
import { createLogger } from "./middleware/logging";

export default class App {

  readonly server = express();
  private container : ServiceContainer;

  constructor(serviceContainer: ServiceContainer) {
    this.container = serviceContainer;
  }

  private registerMiddleware() {
    // Body parsing Middleware
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(createLogger());

    this.server.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });
  }

  private registerRoutes() {

    // Routes
    this.server.use("/authors", new AuthorsController(this.container).router);
    this.server.use("/songs", new SongsController(this.container).router);
    this.server.use("/", new RootController(this.container).router);
  }

  private registerErrorHandlers() {
    this.server.use(errorHandler);
  }

  public getPreparedServer() {
    this.registerMiddleware();
    this.registerRoutes();
    this.registerErrorHandlers();
    return this.server;
  }

  public start(port: number, callback: () => void) {

    this.getPreparedServer().listen(port, callback);
  }

}
