import { Service } from "../core/Service";
import BadRequestError from "../core/errors/BadRequestError";
import { Validator } from "../core/validator";
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

  /**
   * Get all authors in system
   * @returns All authors
   */
  async getAll(): Promise<Author[]> {
    const res = await this.artistsRepo.getMultiple();
    return res.map(x => new Author(x.authorId, x.name, x.surname, x.pseudonym));
  }

  async getMultipleByIds(ids: string[]): Promise<Author[]> {
    const res = await this.artistsRepo.getMultiple({ ids });
    return res.map(x => new Author(x.authorId, x.name, x.surname, x.pseudonym));
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

  async addAuthor(name?: string, pseudonym?: string, surname?: string) {

    const v = (x: unknown) => new Validator()
      .isDefined()
      .isNotEmpty()
      .test(x);

    if (!v(name) && !v(pseudonym) && !v(surname)) {
      throw new BadRequestError(
        "At least one of `name`, `pseudonym` and `surname` should be provided and valid"
      );
    }


    const res = await this.artistsRepo.create({
      name      : name,
      pseudonym : pseudonym,
      surname   : surname
    });

    return new Author(res.authorId, res.name, res.surname, res.pseudonym);
  }

  async getOne(id: string) : Promise<Author> {
    const res = await this.artistsRepo.getOneById(id);
    return new Author(res.authorId, res.name, res.surname, res.pseudonym);
  }

}
