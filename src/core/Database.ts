import Knex from "knex";
import knexfile from "../../knexfile";
import { up } from "../../migrations/20230911212905_init";
import { logger } from "./Logger/Logger";

logger.debug(`env: ${process.env["NODE_ENV"]}`);
const database = Knex(knexfile[(process.env["NODE_ENV"] || "test").trim()]);
export default database;

export function setupDatabase() {
  if (process.env["NODE_ENV"] == "production") throw new Error("Can't reset production database");
  up(database);

  return database;
}
