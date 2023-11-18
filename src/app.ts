import express, { Application } from "express";
import morgan from "morgan";
import "express-async-errors";
import { SongsController } from "./controllers/songsController";
import { RootController } from "./controllers/rootController";
import { ServiceLocator } from "./core/ServiceLocator";
import { SongKnexService } from "./services/SongsService.knex";
import { errorHandler } from "./middleware/error";
import { AuthorsController } from "./controllers/authorsController";

const app: Application = express();

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// Routes
app.use("/authors", new AuthorsController().router);
app.use("/songs", new SongsController().router);
app.use("/", new RootController().router);

app.use(errorHandler);

const locator = new ServiceLocator();
locator.registerService(SongKnexService.id, new SongKnexService());

export default app;
