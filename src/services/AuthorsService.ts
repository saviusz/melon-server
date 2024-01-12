import { Service } from "../core/Service";
import SeeOtherError from "../core/errors/SeeOther";
import UnprocessableEntityError from "../core/errors/UnprocessableEntityError";
import { Author } from "../models/Author";
import { IArtistRefsRepository } from "../repositories/ArtistRefs/ArtistRefsRepository.abstract";
import { IArtistsRepository } from "../repositories/Artists/ArtistsRepository.abstract";

export class AuthorService extends Service {

  private artistsRepo : IArtistsRepository;
  private refsRepo    : IArtistRefsRepository;

  constructor(artistRepo: IArtistsRepository, artistRefsRepo: IArtistRefsRepository) {
    super();
    this.artistsRepo = artistRepo;
    this.refsRepo = artistRefsRepo;
  }

  async addAuthor(name?: string, pseudonym?: string, surname?: string) {

    const isNameDefined = name != undefined && name.trim().length > 1,
          isSurnameDefined = surname != undefined && surname.trim().length > 1,
          isPseudonymDefined = pseudonym != undefined && pseudonym.trim().length > 1;

    if (!(isNameDefined || isSurnameDefined || isPseudonymDefined)) {
      throw new UnprocessableEntityError("Missing Props", [
        {
          code    : "Missing one or more",
          detail  : "Missing one of props: name, pseudonym or surname",
          pointer : "#/-",
        },
      ]);
    }

    const testResp = await this.artistsRepo.find({ name, pseudonym, surname });
    if(testResp.length > 0) throw new SeeOtherError(`/autors/${testResp[0].authorId}`, "Found existing artist with provided details");

    const res = await this.artistsRepo.create({
      name      : name,
      pseudonym : pseudonym,
      surname   : surname
    });

    return new Author(res.authorId, res.name, res.surname, res.pseudonym);
  }

  /**
   * Get all authors in system
   * @returns All authors
   */
  async getAll(): Promise<Author[]> {
    const res = await this.artistsRepo.getMultiple();
    return res.map(x => new Author(
      x.authorId,
      x.name,
      x.surname,
      x.pseudonym
    ));
  }

  async getMultipleByIds(ids: string[]): Promise<Author[]> {
    const res = await this.artistsRepo.getMultiple({ ids });
    return res.map(x => new Author(
      x.authorId,
      x.name,
      x.surname,
      x.pseudonym
    ));
  }

  async getOnSong(songId: string, type: "author" | "textAuthor"): Promise<Author[]> {
    let ids;

    switch (type) {
      case "textAuthor":
        ids = await this.refsRepo.getAuthorsOnSong(songId);
        break;
      default:
      case "author":
        ids = await this.refsRepo.getPerformersOnSong(songId);
        break;
    }

    return this.getMultipleByIds(ids);
  }

  async getOne(id: string) : Promise<Author> {
    const res = await this.artistsRepo.getOneById(id);
    return new Author(
      res.authorId,
      res.name,
      res.surname,
      res.pseudonym
    );
  }

}
