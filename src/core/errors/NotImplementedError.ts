import { Problem } from "./CustomError";

export default class NotImplementedError extends Problem {

  code   : number = 501;
  type   : string = "about:blank";
  title  : string = "Not Implemented";
  detail : string = "Method not implemented";

}
