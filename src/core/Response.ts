import { Response as ExpResponse } from "express";

export enum Status {
  OK = 200,
  Created = 201,
  NotFound = 404,
  InternalServerError = 500,
  NotImplemented = 501,
}

export class Response {
  private _status: Status = Status.OK;
  private _body: any;

  constructor(body: any) {
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

export class ServerErrorResponse extends Response {
  constructor(body?: any) {
    super({
      Status: 500,
      Reason: "Internal Server Error",
    });
    this.status(Status.InternalServerError);
  }
}

export class NotFoundResponse extends Response {
  constructor(body?: any) {
    super({
      Status: 404,
      Reason: "Not Found",
    });
    this.status(Status.NotFound);
  }
}

export class NotImplementedResponse extends Response {
  constructor(body?: any) {
    super({
      Status: 501,
      Reason: "Method not implemented",
    });
    this.status(Status.NotImplemented);
  }
}
