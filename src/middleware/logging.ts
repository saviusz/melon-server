import { NextFunction, Request, Response } from "express";
import { logger } from "../core/Logger/Logger";

export function createLogger() {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime();
    res.on("finish", () => {
      const duration = process.hrtime(start);
      const ms = (duration[0] * 1e3) + (duration[1] * 1e-6);
      logger.info(req.url, { status: res.statusCode, method: req.method, duration: ms });
    });
    next();
  };
}
