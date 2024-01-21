import { randomUUID } from "crypto";
import { Knex } from "knex";

import { ArtistDO, CreateArtistDO, IArtistsRepository } from "./ArtistsRepository.abstract";

export class KnexArtistsRepository implements IArtistsRepository {

  constructor(
    private database: Knex
  ) {
  }

  async create(data: CreateArtistDO): Promise<ArtistDO> {
    const uuid = randomUUID();

    const resp = await this.database<ArtistDO>("author")
      .insert({ authorId: uuid, name: data.name, pseudonym: data.pseudonym, surname: data.surname })
      .returning("*");

    return resp[0];


  }

  async find(params: Partial<ArtistDO>): Promise<ArtistDO[]> {
    const res = await this.database<ArtistDO>("author")
      .where((builder) => {
        if(params.name != undefined) builder.where({ name: params.name });
        if(params.surname != undefined) builder.where({ surname: params.surname });
        if(params.pseudonym != undefined) builder.where({ pseudonym: params.pseudonym });
      })
      .select();

    return res;
  }

  async getMultiple(param?: { ids?: string[] }): Promise<ArtistDO[]> {
    let res = this.database<ArtistDO>("author");
    if(param != undefined) {
      if(param.ids != undefined) res = res.whereIn("authorId", param.ids);
    }
    res.select();

    return res;
  }

  async getOneById(id: string): Promise<ArtistDO> {

    const res = await this.database<ArtistDO>("author")
      .where({ authorId: id })
      .first();

    if (res == undefined) throw new Error("Not found");
    return res;
  }

}
