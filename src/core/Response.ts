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

  setStatus(status: Status) {
    this._status = status;
    return this;
  }

  get body() {
    return this._body;
  }

  get status() {
    return this._status;
  }

  toExpress(res: ExpResponse) {
    return res.status(this._status.valueOf()).send(this._body);
  }

}

