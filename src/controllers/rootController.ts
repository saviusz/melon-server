import { Request } from "express";
import { Resource } from "../core/Resource";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Response } from "../core/Response";

export class RootController extends Resource {

  async getMultiple(): Promise<Response> {
    return new Response({ Wszystko: "ok" });
  }

}
