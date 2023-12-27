import { Problem } from "./CustomError";

interface EntityError {
  code    : string;
  detail  : string;
  pointer : string;
}

export default class UnprocessableEntityError extends Problem {

  code       : number = 422;
  type       : string = "about:blank";
  title      : string = "Unprocessable Request Body";
  detail     : string;
  extensions : { errors: EntityError[] };

  constructor(detail: string, errors: EntityError[]) {
    super();
    this.detail = detail;
    this.extensions = { errors };
  }

}
