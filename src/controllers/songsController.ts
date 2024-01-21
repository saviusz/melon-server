import { Resource } from "../core/Resource";
import { Response, AsyncResponse, Status } from "../core/Response";
import { Song, SongMeta } from "../models/Song";

export interface CreateSongDtO {
  titles        : string[] | undefined;
  authorIds     : string[] | undefined;
  textAuthorIds : string[] | undefined;
}

export class SongsController extends Resource {

  async create(body: CreateSongDtO): AsyncResponse<SongMeta> {
    const song = await this.songsService.createSong({
      titles        : body.titles,
      authorIds     : body.authorIds ?? [],
      textAuthorIds : body.textAuthorIds ?? []
    });
    return new Response(song).setStatus(Status.Created);
  }

  async getMultiple(): AsyncResponse<Array<SongMeta>> {

    const outputList: SongMeta[] = [];

    for (const id of await this.songsService.getIds()) {
      outputList.push(await this.songsService.getMeta(id));
    }

    return new Response(outputList);
  }

  async getOne(id: string): AsyncResponse<Song> {

    const song = await this.songsService.getSong(id);
    return new Response(song);

  }

  get authorsService() {
    return this.services.authorService;
  }

  get songsService() {
    return this.services.songService;
  }

}
