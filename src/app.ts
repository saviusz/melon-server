import express, { Application } from "express";
import morgan from "morgan";
import "express-async-errors";
import { SongsController } from "./controllers/songsController";
import { RootController } from "./controllers/rootController";
import { ServiceContainer } from "./core/ServiceContainer";
import { SongService } from "./services/SongsService";
import { errorHandler } from "./middleware/error";
import { AuthorsController } from "./controllers/authorsController";
import { ContentService } from "./services/ContentService";
import { AuthorService } from "./services/AuthorsService";

const app: Application = express();

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


const container = new ServiceContainer(
  new SongService(),
  new AuthorService(),
  new ContentService()
);


// Routes
app.use("/authors", new AuthorsController(container).router);
app.use("/songs", new SongsController(container).router);
app.use("/", new RootController(container).router);

app.use(errorHandler);

export default app;
