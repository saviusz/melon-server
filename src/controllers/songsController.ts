import { ExpData, Resource } from "../core/Resource";
import { NotImplementedResponse, Response } from "../core/Response";
import db from "../core/Database";
import { Song, SongMeta } from "../models/Song";
import { Author } from "../models/Author";
import { VersionedContent } from "../models/VersionedContent";
import { User } from "../models/User";
import { SongKnexService } from "../services/SongsService.knex";

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

  async getMultiple(): Promise<Response> {
    const outputList = [];

    for (const id of await this.songsService.getIds()) {
      const titles = await this.songsService.getSongTitles(id);

      const authorsResponse = await db("authorOnSong")
        .join("author", "author.authorId", "authorOnSong.authorId")
        .where({ songId: id })
        .select();

      const authors = authorsResponse.map(
        (x) => new Author(x.authorId, x.name, x.surname, x.pseudonym)
      );

      outputList.push(new SongMeta(id, titles, authors, []));
    }

    return new Response(outputList);
  }

  async getOne(id: string): Promise<Response> {
    const titlesResponse = await db("titleOnSong")
      .where({ songId: id })
      .select("title");

    const titles = titlesResponse.map((x) => x.title);
    // .join("authorOnSong", "titleOnSong.songId", "authorOnSong.songId")
    // .join("author", "authorOnSong.authorId", "author.authorId");

    const output = new Song(
      id,
      titles,
      [],
      [],
      new VersionedContent("", "", new User("", "savi"), [])
    );
    return new Response(output);
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
    return new NotImplementedResponse();
  }
}
