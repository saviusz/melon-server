import { Resource } from "../core/Resource";
import { AsyncResponse, Response, Status } from "../core/Response";
import NotFoundError from "../core/errors/NotFoundError";
import { Author } from "../models/Author";

export interface CreateAuthorDtO {
  name      : string | undefined;
  pseudonym : string | undefined;
  surname   : string | undefined;
}

export class AuthorsController extends Resource {

  async create(body: CreateAuthorDtO): AsyncResponse<Author> {

    return new Response(
      await this.authorsService.addAuthor(
        body.name,
        body.pseudonym,
        body.surname
      )
    ).setStatus(Status.Created);
  }

  async getMultiple(): AsyncResponse<Author[]> {
    return new Response(await this.authorsService.getAll());
  }

  async getOne(id: string): AsyncResponse<Author> {
    try {
      return new Response(await this.authorsService.getOne(id));
    } catch (e) {
      throw new NotFoundError(`Could not find artist with id '${id}'`);
    }
  }

  get authorsService() {
    return this.services.authorService;
  }

}
