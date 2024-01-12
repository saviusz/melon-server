import { ArtistDO, CreateArtistDO, IArtistsRepository } from "./ArtistsRepository.abstract";

export class DummyArtistsRepository implements IArtistsRepository {

  constructor(
    private _authors: ArtistDO[] = [],
  ) {}

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

  async find({ name, surname, pseudonym }: Partial<ArtistDO>): Promise<ArtistDO[]> {
    return this._authors.filter(x => {
      let result = true;
      if (name != undefined && name.trim().length > 0) result &&= name == x.name;
      if (surname != undefined && surname.trim().length > 0) result &&= surname == x.surname;
      if (pseudonym != undefined && pseudonym.trim().length > 0) result &&= pseudonym == x.pseudonym;
      return result;
    });
  }

  async getMultiple(props?: { ids?: string[] } ): Promise<ArtistDO[]> {
    if(props != undefined && props.ids != undefined) return this._authors.filter(x => props.ids?.includes(x.authorId));
    return this._authors;
  }

  async getOneById(id: string): Promise<ArtistDO> {
    const found = this._authors.find(x => x.authorId == id);
    if (found) return found;
    else throw new Error("Not found");
  }

}
