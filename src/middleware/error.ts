import { NextFunction, Request, Response } from "express";
import { Problem } from "../core/errors/CustomError";
import { logger } from "../core/Logger/Logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // Handled errors
  if (err instanceof Problem) {
    return res
      .status(err.code)
      .send(err.getFormatted());
  }

  // @ts-expect-error Non typed error
  if(err.type == "entity.parse.failed") {
    return res
      .status(400)
      .send({ errors: [ { message: err.message ?? "Failed parsing request" } ] });
  }

  // Unhandled errors
  logger.error(err);
  return res
    .status(500)
    .send({
      type     : "about:blank",
      title    : "Internal server error",
      detail   : "Encountered unknown error",
      instance : "",
      error    : {
        name    : err.name,
        message : err.message,
      }
    });
};
