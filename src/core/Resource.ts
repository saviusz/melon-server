import express, { Request, Response as ExpResponse } from "express";

import { AsyncResponse } from "./Response";
import ServiceContainer from "./ServiceContainer";
import NotFoundError from "./errors/NotFoundError";
import NotImplementedError from "./errors/NotImplementedError";

export interface ExpData {
  req : Request;
  res : ExpResponse;
}

export abstract class Resource {

  private _router;
  private container : ServiceContainer;

  constructor(container: ServiceContainer) {
    this.container = container;
    this._router = express.Router();
    this._router.get("/", (req, res) =>
      this.getMultiple({ req, res }).then((x) => x.toExpress(res)));

    this._router.get("/:id", (req, res) =>
      this.getOne(req.params.id, { req, res }).then((x) => x.toExpress(res)));

    this._router.post("/", (req, res) =>
      this
        .create(req.body, { req, res })
        .then((x) => x.toExpress(res)));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(body: unknown, opt?: ExpData): AsyncResponse<unknown> {
    throw new NotImplementedError();
  }

  async delete(): AsyncResponse<unknown> {
    throw new NotImplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getMultiple(opt?: ExpData): AsyncResponse<unknown> {
    throw new NotFoundError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getOne(id: string, opt?: ExpData): AsyncResponse<unknown> {
    throw new NotFoundError();
  }

  get router() {
    return this._router;
  }

  get services() {
    return this.container.services;
  }

}
