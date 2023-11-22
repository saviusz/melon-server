import { Resource } from "../core/Resource";
import { Response, AsyncResponse } from "../core/Response";
import { Song, SongMeta } from "../models/Song";
import { SongService } from "../services/SongsService";
import { AuthorKnexService } from "../services/AuthorsService";
import NotImplementedError from "../core/errors/NotImplementedError";
import { Validator } from "../core/validator";

export interface CreateSongDtO {
  titles        : string[];
  authorIds     : string[];
  textAuthorIds : string[];
}

export class SongsController extends Resource {

  songsService = new SongService();
  authorsService = new AuthorKnexService();

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

  async create(body: CreateSongDtO): AsyncResponse<unknown> {

    const titleErrors = new Validator()
      .isArray()
      .isNotEmpty()
      .getFails(body.titles);

    if(titleErrors.length > 1) throw new Error("Error");

    this.songsService.createSong({ titles: body.titles, authorIds: [], textAuthorIds: [] });

    throw new NotImplementedError();

    const missingProps = [];

    if (body.titles == undefined || body.titles.length < 1) missingProps.push("titles");

    // if (missingProps.length > 0) throw new MissingPropsResponse(missingProps);


    return new Response({});
  }

}
