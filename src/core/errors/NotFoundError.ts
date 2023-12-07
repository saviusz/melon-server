import { Problem } from "./CustomError";

export default class NotFoundError extends Problem {

  code    : number = 404;
  type    : string = "about:blank";
  title   : string = "Not Found";
  detail? : string;

  constructor(detail?: string ) {
    super();
    this.detail = detail;
  }

}
