import { describe, expect, it } from "vitest";
import Knex from "knex";
import knexfile from "../../knexfile";
import { ArtistDO, IArtistsRepository } from "../../src/repositories/Artists/ArtistsRepository.abstract";
import { up } from "../../migrations/20230911212905_init";
import { DummyArtistsRepository } from "../../src/repositories/Artists/ArtistsRepository.dummy";
import { KnexArtistsRepository } from "../../src/repositories/Artists/ArtistsRepository.knex";

const database = Knex(knexfile["test"]);
up(database);

describe.each([
  { name: "Knex", repo: new KnexArtistsRepository(database) },
  { name: "Dummy", repo: new DummyArtistsRepository() }
])("$name Authors Repo", ({ repo }: { repo: IArtistsRepository }) => {
  describe("when adding with valid data", () => {
    let valid: ArtistDO;
    it("should create", async () => {
      valid = await repo.create({
        name      : "Imie",
        pseudonym : "Pseudonym",
        surname   : "Nazwisko"
      });
    });

    it("should be readeble", async () => {
      // Act
      const response = await repo.getOneById(valid.authorId);

      // Assert
      expect(response).toMatchObject(valid);
    });

    it("should be displayed in all authors", async () => {
      // Act
      const response = await repo.getMultiple();

      // Assert
      expect(response).toContainEqual(valid);
    });

  });
});
