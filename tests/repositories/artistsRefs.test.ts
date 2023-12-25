import { describe, expect, it } from "vitest";
import Knex from "knex";
import knexfile from "../../knexfile";
import { up } from "../../migrations/20230911212905_init";
import { DummyArtistRefsRepository } from "../../src/repositories/ArtistRefs/ArtistRefsRepository.dummy";
import { KnexArtistRefsRepository } from "../../src/repositories/ArtistRefs/ArtistRefsRepository.knex";

const database = Knex(knexfile["test"]);
up(database);

describe.each([
  { name: "Dummy", repo: new DummyArtistRefsRepository() },
  { name: "Knex", repo: new KnexArtistRefsRepository(database) }
])("$name Artist Refs Repo", async ({ repo, name }) => {
  if(name == "Knex") await database("author").insert([
    { authorId: "aasdfko", name: "test" },
    { authorId: "befka", name: "elo" }
  ]);
  describe("When adding author with correct data", () => {
    // Arrange
    const songId = "19264";
    const authorId = "aasdfko";

    it("should create", async () => {
      // Act
      const response = await repo.addAuthorRef(songId, authorId);

      // Assert
      expect(response).toBe(true);
    });

    it("should be readable", async () => {
      const response = await repo.getAuthorsOnSong(songId);

      expect(response).toContain(authorId);
      expect(response).toHaveLength(1);
    });
  });

  describe("When adding performer with correct data", () => {
    // Arrange
    const songId = "19264";
    const authorId = "befka";

    it("should create", async () => {
      // Act
      const response = await repo.addPerformerRef(songId, authorId);

      // Assert
      expect(response).toBe(true);
    });

    it("should be readable", async () => {
      const response = await repo.getPerformersOnSong(songId);

      expect(response).toContain(authorId);
      expect(response).toHaveLength(1);
    });
  });
});
