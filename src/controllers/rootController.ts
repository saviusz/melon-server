import { Resource } from "../core/Resource";
import { AsyncResponse, Response } from "../core/Response";

export class RootController extends Resource {

  async getMultiple(): AsyncResponse<unknown> {
    return new Response({ Wszystko: "ok" });
  }

}
