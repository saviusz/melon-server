import { Request } from "express";
import { ExpData, Resource } from "../core/Resource";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Response } from "../core/Response";
import db from "../core/Database";

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
  async getMultiple(): Promise<Response> {
    const list = await db("titleOnSong").select();
    return new Response(list);
  }
  async getOne(): Promise<Response> {
    return new Response({ pojedyczy: "odpowiedz" });
  }
  async create(body: CreateSongDtO): Promise<Response> {
    const songId = await db.fn.uuid();
    db.transaction(async (trx) => {
      trx("titlesOnSong").insert(
        body.titles.map((title) => ({
          songId: songId,
          title: title,
        }))
      );
    });
  }
}
