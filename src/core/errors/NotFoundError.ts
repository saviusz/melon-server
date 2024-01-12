import { Problem } from "./CustomError";

export default class NotFoundError extends Problem {

  code    : number = 404;
  detail? : string;
  title   : string = "Not Found";
  type    : string = "about:blank";

  constructor(detail?: string ) {
    super();
    this.detail = detail;
  }

}
