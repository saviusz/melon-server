import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import { SongsController } from "./controllers/songsController";
import { RootController } from "./controllers/rootController";

const app: Application = express();

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/songs", new SongsController().router);
app.use("/", new RootController().router);

export default app;