import { CustomError } from "./CustomError";

export default class NotImplementedError extends CustomError {

  private static readonly _statusCode = 501;
  private readonly _code    : number;
  private readonly _context : { [key: string]: unknown };

  constructor(params?: {
    code?    : number;
    message? : string;
    context? : { [key: string]: unknown };
  }) {
    const { code, message } = params || {};

    super(message || "Not implemented");
    this._code = code || NotImplementedError._statusCode;
    this._context = params?.context || {};
  }

  get errors() {
    return [ { message: this.message, context: this._context } ];
  }

  get statusCode() {
    return this._code;
  }

}
