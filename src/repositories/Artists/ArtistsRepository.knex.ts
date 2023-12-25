import { randomUUID } from "crypto";
import { ArtistDO, CreateArtistDO, IArtistsRepository } from "./ArtistsRepository.abstract";
import { Knex } from "knex";

export class KnexArtistsRepository implements IArtistsRepository {

  constructor(
    private database: Knex
  ) {
  }

  async create(data: CreateArtistDO): Promise<ArtistDO> {
    const uuid = randomUUID();

    const resp = await this.database<ArtistDO>("author")
      .insert({ artistId: uuid, name: data.name, pseudonym: data.pseudonym, surname: data.surname })
      .returning("*");

    return resp[0];


  }

}
