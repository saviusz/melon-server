import { NextFunction, Request, Response } from "express";
import { CustomError } from "../core/errors/CustomError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // Handled errors
  if (err instanceof CustomError) {
    const { statusCode, errors } = err;

    console.error(
      JSON.stringify(
        {
          code   : err.statusCode,
          errors : err.errors,
          stack  : err.stack,
        },
        null,
        2
      )
    );

    return res.status(statusCode).send({ errors });
  }

  // @ts-expect-error Non typed error
  if(err.type == "entity.parse.failed") {
    return res
      .status(400)
      .send({ errors: [ { message: err.message ?? "Failed parsing request" } ] });
  }

  // Unhandled errors
  console.error(err);
  return res
    .status(500)
    .send({ errors: [ { message: "Something went wrong" } ] });
};
