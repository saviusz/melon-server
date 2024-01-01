import { ArtistDO, CreateArtistDO, IArtistsRepository } from "./ArtistsRepository.abstract";

export class DummyArtistsRepository implements IArtistsRepository {

  constructor(
    private _authors: ArtistDO[] = [],
  ) {}

  async getOneById(id: string): Promise<ArtistDO> {
    const found = this._authors.find(x => x.authorId == id);
    if (found) return found;
    else throw new Error("Not found");
  }

  async getMultiple(props?: { ids?: string[] } ): Promise<ArtistDO[]> {
    if(props != undefined && props.ids != undefined) return this._authors.filter(x => props.ids?.includes(x.authorId));
    return this._authors;
  }

  async create(data: CreateArtistDO): Promise<ArtistDO> {
    this._authors.push({
      authorId  : "id",
      name      : data.name ?? "",
      surname   : data.surname ?? "",
      pseudonym : data.pseudonym ?? ""
    });

    return {
      authorId  : "id",
      name      : data.name ?? "",
      surname   : data.surname ?? "",
      pseudonym : data.pseudonym ?? ""
    };
  }

}
