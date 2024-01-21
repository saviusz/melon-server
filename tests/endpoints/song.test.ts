import { describe, expect, it, test } from "vitest";

import { SongsController } from "../../src/controllers/songsController";
import { filledArtistsRepo, validArtists } from "../stubs/artists";
import { emptyContainer } from "../stubs/serviceContainer";
import { partialSongMetaContiner, validSongMetas } from "../stubs/songMetaContainer";
import { validTitles } from "../stubs/titles";

const filledContainer = () =>
  partialSongMetaContiner({ artistRepo: filledArtistsRepo() });

describe("Song data", () => {
  describe("GET: /songs", () => {
    it("on empty database should return empty response", async () => {
      // Arrange
      const controller = new SongsController(emptyContainer());

      // Act
      const response = await controller.getMultiple();

      // Assert
      expect(response.body).toHaveLength(0);
    });

    it("on filled database should return songs", async () => {
      // Arrange
      const controller = new SongsController(filledContainer());

      // Act
      const response = await controller.getMultiple();

      // Assert
      expect(response.body).toMatchObject(validSongMetas());
    });
  });

  describe("GET: /song/:id", () => {

    it.each(validSongMetas())(
      "with existing id $songId should return song",
      async (meta) => {
        // Arrange
        const controller = new SongsController(filledContainer());

        // Act
        const response = await controller.getOne(meta.songId);

        // Assert
        expect(response.body).toMatchObject({ id: meta.songId, authors: meta.authors, textAuthors: meta.textAuthors, titles: meta.titles });
      }
    );


    it.each(validSongMetas())("with unknown id $songId should throw", (meta) => {
      // Arrange
      const controller = new SongsController(emptyContainer());

      // Act
      const response = controller.getOne(meta.songId);

      // Assert
      expect(response).rejects.toMatchObject({ code: 404 });
    });
  });

  describe("POST: /songs", () => {

    it.each(validSongMetas())("should create Song(titles: $titles)", async (meta) => {

      // Arrange
      const controller = new SongsController(filledContainer());

      // Act
      const response = await controller.create({
        titles        : meta.titles,
        authorIds     : meta.authors.map(artist => artist.id),
        textAuthorIds : meta.textAuthors.map(artist => artist.id)
      });

      // Assert
      expect(response.body).toMatchObject({
        songId      : expect.any(String),
        titles      : meta.titles,
        authors     : meta.authors,
        textAuthors : meta.textAuthors,
      });
      expect(response.status).toBe(201);
      expect((await controller.getOne(response.body.songId)).body).toMatchObject({
        id          : response.body.songId,
        titles      : response.body.titles,
        authors     : response.body.authors,
        textAuthors : response.body.textAuthors
      });
    });


    test("without titles provided throw", async () => {
      // Arrange
      const titles: string[] = [];
      const controller = new SongsController(filledContainer());

      // Act
      const response = controller.create({
        titles        : titles,
        authorIds     : [],
        textAuthorIds : [],
      });

      // Assert
      await expect(response).rejects.toMatchObject({ code: 422 });
    });

    test("with titles prop undefined should throw", async () => {
      // Arrange
      const titles: string[] | undefined = undefined;
      const controller = new SongsController(filledContainer());

      // Act
      const response = controller.create({
        titles        : titles ?? [],
        authorIds     : [],
        textAuthorIds : [],
      });

      // Assert
      await expect(response).rejects.toMatchObject({ code: 422 });
    });

    test("with only empty strings provided should throw", async () => {
      // Arrange
      const titles: string[] = [ "", "" ];
      const controller = new SongsController(filledContainer());

      // Act
      const response = controller.create({
        titles        : titles,
        authorIds     : [],
        textAuthorIds : [],
      });

      // Assert
      await expect(response).rejects.toMatchObject({ code: 422 });
    });

    test("with ids of not existent authors", async () => {
      // Arrange
      const titles: string[] = validTitles["----uuid1-----"];
      const controller = new SongsController(emptyContainer());

      // Act
      const response = controller.create({
        titles        : titles,
        authorIds     : validArtists.map(x => x.authorId),
        textAuthorIds : [],
      });

      // Assert
      await expect(response).rejects.toMatchObject({ code: 422 });
    });

    test("with ids of not existent performers", async () => {
      // Arrange
      const titles: string[] = validTitles["328dfsxzcbhtemjdf"];
      const controller = new SongsController(emptyContainer());

      // Act
      const response = controller.create({
        titles        : titles,
        authorIds     : [],
        textAuthorIds : validArtists.map(x => x.authorId),
      });

      // Assert
      await expect(response).rejects.toMatchObject({ code: 422 });
    });
  });
});
