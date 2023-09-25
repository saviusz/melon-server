import { Resource } from "../core/Resource";
import {
  NotFoundResponse,
  NotImplementedResponse,
  Response,
  ServerErrorResponse,
} from "../core/Response";
import db from "../core/Database";
import { SongMeta } from "../models/Song";
import { SongKnexService } from "../services/SongsService.knex";
import { AuthorKnexService } from "../services/AuthorsService.knex";
import { CustomError, ErrorType } from "../core/Error";

export interface CreateSongDtO {
  titles: string[];
  //   authors: Array<{
  //     name?: string;
  //     surname: string;
  //     psudonym: string;
  //   }>;
  //   textAuthors: Array<{
  //     name?: string;
  //     surname: string;
  //     psudonym: string;
  //   }>;
}

export class SongsController extends Resource {
  songsService = new SongKnexService();
  authorsService = new AuthorKnexService();

  async getMultiple(): Promise<Response> {
    const outputList: SongMeta[] = [];

    for (const id of await this.songsService.getIds()) {
      outputList.push(await this.songsService.getMeta(id));
    }

    return new Response(outputList);
  }

  async getOne(id: string): Promise<Response> {
    try {
      const song = await this.songsService.getSong(id);
      return new Response(song);
    } catch (error) {
      console.log(error);
      const err = error as CustomError;
      switch (err.type) {
        case ErrorType.NotFound:
          return new NotFoundResponse(err.message);

        default:
          return new ServerErrorResponse(err.message);
      }
    }
  }

  async create(body: CreateSongDtO): Promise<Response> {
    
    const resp = await this.authorsService.addAuthor("snowy", "kurde", "autor");

    // const songId = await db.fn.uuid();

    // db.transaction(async (trx) => {
    //   trx("titlesOnSong").insert(
    //     body.titles.map((title) => ({
    //       songId: songId,
    //       title: title,
    //     }))
    //   );
    //   trx("authorOnSong").insert(
    //     body.titles.map((title) => ({
    //       songId: songId,
    //       title: title,
    //     }))
    //   );
    // });
    return new Response(resp);
  }
}
