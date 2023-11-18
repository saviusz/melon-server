import { ExpData, Resource } from "../core/Resource";
import { AsyncResponse, Response } from "../core/Response";
import BadRequestError from "../core/errors/BadRequestError";
import { Validator } from "../core/validator";
import { Author } from "../models/Author";

export interface CreateAuthorDtO {
  name      : string;
  pseudonym : string;
  surname   : string;
}

export class AuthorsController extends Resource {

  async create(body: CreateAuthorDtO): AsyncResponse<Author> {
    const exist = new Validator()
      .isDefined();
    const atLeastOne = exist.test(body.name)
    || exist.test(body.pseudonym)
    || exist.test(body.surname);
    const nameErrors = new Validator().isString()
      .getFails(body.name);
    const pseudonymErrors = new Validator().isString()
      .getFails(body.pseudonym);
    const surnameErrors = new Validator().isString()
      .getFails(body.surname);

    if (!atLeastOne
      || nameErrors.length > 0
      || pseudonymErrors.length > 0
      || surnameErrors.length > 0
    ) throw new BadRequestError({ message: "Missing props" });

    return new Response(new Author("", body.name, body.surname, body.pseudonym));
  }

}
