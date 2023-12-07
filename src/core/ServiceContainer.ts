import { AuthorService } from "../services/AuthorsService";
import { ContentService } from "../services/ContentService";
import { SongService } from "../services/SongsService";


export class ServiceContainer {

  constructor(
    readonly songService    : SongService,
    readonly authorService  : AuthorService,
    readonly contentService : ContentService
  ) {
    this.songService.injectServices(this);
    this.authorService.injectServices(this);
    this.contentService.injectServices(this);
  }

}
