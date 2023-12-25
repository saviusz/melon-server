import { Knex } from "knex";
import { IArtistRefsRepository } from "./ArtistRefsRepository.abstract";
import { logger } from "../../core/Logger/Logger";

export class KnexArtistRefsRepository implements IArtistRefsRepository {

  constructor(private database: Knex) {}

  async addAuthorRef(songId: string, authorId: string): Promise<boolean> {
    try {
      await this.database<{ songId: string; authorId: string }>("textAuthorOnSong")
        .insert({ songId, authorId });
    } catch(e) {
      logger.warn(e as Error);
      return false;
    }
    return true;
  }

  async addPerformerRef(songId: string, authorId: string): Promise<boolean> {
    try {
      await this.database<{ songId: string; authorId: string }>("authorOnSong")
        .insert({ songId, authorId });
    } catch(e) {
      logger.warn(e as Error);
      return false;
    }
    return true;
  }

  async getAuthorsOnSong(songId: string): Promise<string[]> {
    return (
      await this.database<{ songId: string; authorId: string }>("textAuthorOnSong")
        .where({ songId: songId })
        .select())
      .map(x => x.authorId);
  }

  async getPerformersOnSong(songId: string): Promise<string[]> {
    return (
      await this.database<{ songId: string; authorId: string }>("authorOnSong")
        .where({ songId: songId })
        .select())
      .map(x => x.authorId);
  }

}
