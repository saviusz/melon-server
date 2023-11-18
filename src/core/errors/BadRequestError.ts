import { CustomError } from "./CustomError";

export default class BadRequestError extends CustomError {

  private static readonly _statusCode = 400;
  private readonly _code    : number;
  private readonly _context : { [key: string]: unknown };

  constructor(params?: {
    code?    : number;
    message? : string;
    context? : { [key: string]: unknown };
  }) {
    const { code, message } = params || {};

    super(message || "Bad request");
    this._code = code || BadRequestError._statusCode;
    this._context = params?.context || {};
  }

  get errors() {
    return [ { message: this.message, context: this._context } ];
  }

  get statusCode() {
    return this._code;
  }

}
