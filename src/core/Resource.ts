import express, { Request, Response as ExpResponse } from "express";
import { STATUS_CODES } from "http";
import { NotFoundResponse, NotImplementedResponse, Response } from "./Response";

export interface ExpData {
  req: Request;
  res: ExpResponse;
}

export abstract class Resource {
  private _router;
  constructor() {
    this._router = express.Router();
    this._router.get("/", (req, res) =>
      this.getMultiple({ req, res }).then((x) => x.toExpress(res))
    );
    this._router.get("/:id", (req, res) =>
      this.getOne(req.params.id, { req, res }).then((x) => x.toExpress(res))
    );

    this._router.post("/", (req, res) =>
      this.getOne(req.body, { req, res }).then((x) => x.toExpress(res))
    );
  }

  async getMultiple(opt?: ExpData): Promise<Response> {
    return new NotFoundResponse();
  }

  async getOne(id: string, opt?: ExpData): Promise<Response> {
    return new NotFoundResponse();
  }

  async create(body: any, opt?: ExpData): Promise<Response> {
    return new NotImplementedResponse();
  }

  get router() {
    return this._router;
  }
}
