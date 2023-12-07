import { Problem } from "./CustomError";

export default class BadRequestError extends Problem {

  code   : number = 400;
  type   : string = "about:blank";
  title  : string = "Not Found";
  detail : string;

  constructor(detail: string) {
    super();
    this.detail = detail;
  }

}
