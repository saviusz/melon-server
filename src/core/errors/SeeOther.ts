import { Problem } from "./CustomError";

export default class SeeOtherError extends Problem {

  code       : number = 303;
  detail?    : string;
  extensions : { location: string };
  title      : string = "See Other";
  type       : string = "about:blank";

  constructor(location:string, detail?: string) {
    super();
    this.detail = detail;
    this.extensions = { location };
  }

}
