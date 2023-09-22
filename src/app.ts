import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import { SongsController } from "./controllers/songsController";
import { RootController } from "./controllers/rootController";
import { ServiceLocator } from "./core/ServiceLocator";
import { SongKnexService } from "./services/SongsService.knex";

const app: Application = express();

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/songs", new SongsController().router);
app.use("/", new RootController().router);

const locator = new ServiceLocator();
locator.registerService(SongKnexService.id, new SongKnexService());

export default app;
