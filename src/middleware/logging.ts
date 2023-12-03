import { NextFunction, Request, Response } from "express";
import { logger } from "../core/Logger/Logger";

export function createLogger() {
  return (req: Request, res: Response, next: NextFunction) => {
    res.on("finish", () => {
      logger.info(req.url, { status: res.statusCode, method: req.method });
    });
    next();
  };
}
