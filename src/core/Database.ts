import Knex from "knex";
import knexfile from "../../knexfile";

const database = Knex(knexfile["development"]);
export default database;
