import Knex from "knex";
import { describe, expect, it } from "vitest";

import knexfile from "../../knexfile";
import { up } from "../../migrations/20230911212905_init";
import { ITitlesRepository } from "../../src/repositories/Titles/TitlesRepository.abstract";
import { DummyTitlesRepository } from "../../src/repositories/Titles/TitlesRepository.dummy";
import { KnexTitlesRepository } from "../../src/repositories/Titles/TitlesRepository.knex";

const database = Knex(knexfile["test"]);
up(database);

describe.each([
  { name: "Knex", repo: new KnexTitlesRepository(database) },
  { name: "Dummy", repo: new DummyTitlesRepository() }
])("$name Titles Repo", ({ repo }: { repo: ITitlesRepository }) => {
  describe("when adding one with valid data", () => {
    const validTitle = "tytul";
    const validSongId = "songId";
    it("should return provided title", async () => {
      // Act
      const res = await repo.add(validSongId, validTitle);

      // Assert
      expect(res).toBe(validTitle);
    });

    it("should be included in titles of song", async () => {
      // Act
      const res = await repo.getOnSong(validSongId);

      // Assert
      expect(res).toContain(validTitle);
    });

    it("should create songId in list of all ids", async () => {
      // Act
      const res = await repo.getSongsIds();

      // Assert
      expect(res).toContain(validSongId);
    });

  });

  describe("when adding multiple with valid data", () => {
    const validTitles = [ "Pieśń rozdartego serca", "Aezakmi" ];
    const validSongId = "songId";
    it("should return provided titles", async () => {
      // Act
      const res = await repo.addMany(validSongId, validTitles);

      // Assert
      expect(res).toEqual(validTitles);
    });

    it("should be included in titles of song", async () => {
      // Act
      const res = await repo.getOnSong(validSongId);

      // Assert
      expect(res).toEqual(expect.arrayContaining(validTitles));
    });

    it("should create songId in list of all ids", async () => {
      // Act
      const res = await repo.getSongsIds();

      // Assert
      expect(res).toContain(validSongId);
    });

  });
});
