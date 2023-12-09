import { Service } from "../core/Service";
import BadRequestError from "../core/errors/BadRequestError";
import { Validator } from "../core/validator";
import { Author } from "../models/Author";
import { IAuthorsRepository } from "../repositories/Authors/AuthorsRepository.abstract";

export class AuthorService extends Service {

  private authorsRepo: IAuthorsRepository;

  constructor(authorsRepo: IAuthorsRepository) {
    super();
    this.authorsRepo = authorsRepo;
  }

  async getAll(): Promise<Author[]> {
    const res = this.authorsRepo.getMultiple();
    return res;
  }

  async getOnSong(songId: string, type: "author" | "textAuthor"): Promise<Author[]> {
    return await this.authorsRepo.getOnSong(songId, type);
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


    return this.authorsRepo.addOne({
      name      : name,
      pseudonym : pseudonym,
      surname   : surname
    });
  }

  getOne(id: string) {
    return this.authorsRepo.getOneById(id);
  }

}
