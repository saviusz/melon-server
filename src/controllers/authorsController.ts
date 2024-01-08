import { Resource } from "../core/Resource";
import { AsyncResponse, Response } from "../core/Response";
import UnprocessableEntityError from "../core/errors/UnprocessableEntityError";
import { Validator } from "../core/validator";
import { Author } from "../models/Author";

export interface CreateAuthorDtO {
  name      : string | undefined;
  pseudonym : string | undefined;
  surname   : string | undefined;
}

export class AuthorsController extends Resource {

  async create(body: CreateAuthorDtO): AsyncResponse<Author> {
    const exist = new Validator().isDefined();
    const atLeastOne
      = exist.test(body.name)
      || exist.test(body.pseudonym)
      || exist.test(body.surname);
    const nameErrors = new Validator().isString()
      .getFails(body.name);
    const pseudonymErrors = new Validator().isString()
      .getFails(body.pseudonym);
    const surnameErrors = new Validator().isString()
      .getFails(body.surname);

    if (
      !atLeastOne
      || nameErrors.length > 0
      || pseudonymErrors.length > 0
      || surnameErrors.length > 0
    ) throw new UnprocessableEntityError("Missing Props", [
      {
        code    : "Missing one or more",
        detail  : "Missing one of props: name, pseudonym or surname",
        pointer : "#/-",
      },
    ]);

    return new Response(
      await this.authorsService.addAuthor(
        body.name,
        body.pseudonym,
        body.surname
      )
    );
  }

  async getMultiple(): AsyncResponse<Author[]> {
    return new Response(await this.authorsService.getAll());
  }

  get authorsService() {
    return this.services.authorService;
  }

}
