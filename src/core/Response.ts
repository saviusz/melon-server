import { Response as ExpResponse } from "express";

export enum Status {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  NotFound = 404,
  InternalServerError = 500,
  NotImplemented = 501,
}

export type AsyncResponse<T> = Promise<Response<T>>;
export class Response<T> {

  private _status : Status = Status.OK;
  private _body   : T;

  constructor(body: T) {
    this._body = body;
  }

  status(status: Status) {
    this._status = status;
    return this;
  }

  toExpress(res: ExpResponse) {
    return res.status(this._status.valueOf()).send(this._body);
  }

}

/* export class ServerErrorResponse extends Response<T> {

  constructor() {
    super({
      Status : 500,
      Reason : "Internal Server Error",
    });
    this.status(Status.InternalServerError);
  }

}

export class NotFoundResponse extends Response {

  constructor(body?: any) {
    super({
      Status : 404,
      Reason : body,
    });
    this.status(Status.NotFound);
  }

}

export class NotImplementedResponse extends Response {

  constructor(body?: unknown) {
    super({
      Status : 501,
      Reason : "Method not implemented",
    });
    this.status(Status.NotImplemented);
  }

}

export class BadRequestResponse extends Response {

  constructor(description: string) {
    super({
      Status      : 400,
      Reason      : "Bad Request",
      Description : description,
    });
    this.status(Status.BadRequest);
  }

} */

/* export class MissingPropsResponse extends BadRequestResponse {

  constructor(missingProps: string[]) {
    super(`Missing props: ${missingProps.join(", ")}`);
  }

}
 */
