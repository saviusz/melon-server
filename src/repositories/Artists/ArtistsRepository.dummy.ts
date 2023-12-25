import { Author } from "../../models/Author";
import { ArtistDO, CreateArtistDO, IArtistsRepository } from "./ArtistsRepository.abstract";

export class DummyArtistsRepository implements IArtistsRepository {

  constructor(
    private _authors: ArtistDO[] = [],
  ) {}

  async create(data: CreateArtistDO): Promise<ArtistDO> {
    return {
      artistId  : "id",
      name      : data.name ?? "",
      surname   : data.surname ?? "",
      pseudonym : data.pseudonym ?? ""
    };
  }

}
