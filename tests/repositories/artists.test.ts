import Knex from "knex";
import { describe, expect, it } from "vitest";

import knexfile from "../../knexfile";
import { up } from "../../migrations/20230911212905_init";
import { ArtistDO, IArtistsRepository } from "../../src/repositories/Artists/ArtistsRepository.abstract";
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

    describe("should be possible to find", () => {
      it("using name", async () => {
      // Act
        const response = await repo.find({ name: "Imie" });

        // Assert
        expect(response).toContainEqual(valid);
      });

      it("using surname", async () => {
        // Act
        const response = await repo.find({ surname: "Nazwisko" });

        // Assert
        expect(response).toContainEqual(valid);
      });

      it("using pseudonym", async () => {
        // Act
        const response = await repo.find({ pseudonym: "Pseudonym" });

        // Assert
        expect(response).toContainEqual(valid);
      });

      it("using pseudonym and undefined", async () => {
        // Act
        const response = await repo.find({ pseudonym: "Pseudonym", name: undefined });

        // Assert
        expect(response).toContainEqual(valid);
      });
    });
  });
});
