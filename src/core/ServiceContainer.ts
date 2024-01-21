import { AuthorService } from "../services/AuthorsService";
import { ContentService } from "../services/ContentService";
import { SongService } from "../services/SongsService";
import { Service } from "./Service";

interface ServicesObject {
  authorService  : AuthorService;
  songService    : SongService;
  contentService : ContentService;
}

export default class ServiceContainer {

  readonly services: ServicesObject;

  constructor(services: ServicesObject) {
    this.services = services;

    Object.values(this.services).forEach((service: Service) =>
      service.injectServices(this));
  }

}
