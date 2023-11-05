import db from "../core/Database";
import { readFile } from "fs/promises";
import { ContentService } from "../interfaces/ContentService";
import { Part } from "../models/Parts";
import { User } from "../models/User";
import {
  VersionedContent,
  VersionedContentMeta,
} from "../models/VersionedContent";
import { NotFoundError } from "../core/Error";

const filePath = "./data/songs";

export class ContentFilesystemKnexService implements ContentService {

  async getDeafultVersion(songId: string) {
    const response = await db("versionedContentOnSong")
      .where({ songId: songId })
      .first();

    if (!response) throw new NotFoundError("version on song", songId);

    const file = await readFile(`${filePath}/${response.filename}`, { encoding: "utf8" });
    const parts = JSON.parse(file).map((x: any) => Part.fromJSON(x));

    return new VersionedContent(
      response.id,
      response.name,
      new User(response.versionAuthorId, "placeholder"),
      parts
    );
  }

  async getMetaBySong(songId: string): Promise<VersionedContentMeta[]> {
    const response = await db("versionedContentOnSong")
      .where({ songId: songId })
      .select();

    return response.map(
      (version) => new VersionedContentMeta(
        version.id,
        version.name,
        new User(version.versionAuthorId, "placeholder")
      )
    );
  }

  async getById(id: string): Promise<VersionedContent> {
    const response = await db("versionedContentOnSong")
      .where({ contentId: id })
      .first();

    const file = await readFile(`${filePath}/${response.filename}`, { encoding: "utf8" });
    const parts = JSON.parse(file) as Part[];

    return new VersionedContent(
      response.id,
      response.name,
      new User(response.versionAuthorId, "placeholder"),
      parts
    );
  }

  /* getPartsFromFile(filename: string) {
    return [new Part()];
  } */

}
