import { describe } from "vitest";

import Knex from "knex";
import knexfile from "../../knexfile";
import { up } from "../../migrations/20230911212905_init";
import { ITitlesRepository } from "../../src/repositories/Titles/TitlesRepository.abstract";
import { DummyTitlesRepository } from "../../src/repositories/Titles/TitlesRepository.dummy";
import { KnexTitlesRepository } from "../../src/repositories/Titles/TitlesRepository.knex";

const database = Knex(knexfile["test"]);
up(database);

describe.todo.each([
  { name: "Knex", repo: new KnexTitlesRepository(database) },
  { name: "Dummy", repo: new DummyTitlesRepository() }
])("$name Titles Repo", ({ repo }: { repo: ITitlesRepository }) => {
  describe("when adding with valid data", () => {

    // TODO: Add this test

  });
});
