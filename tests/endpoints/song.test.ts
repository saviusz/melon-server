import { describe, expect, it, test } from "vitest";

import { SongsController } from "../../src/controllers/songsController";
import { Response } from "../../src/core/Response";
import { Author } from "../../src/models/Author";
import { filledArtistsRepo } from "../stubs/artists";
import { emptyContainer } from "../stubs/serviceContainer";
import { partialSongMetaContiner, validSongMetas } from "../stubs/songMetaContainer";

const validIds = [ "id", "694202137" ];

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
    test.each(validIds)(
      "with existing id '%s' should return song",
      async (id) => {
        // Arrange
        const controller = new SongsController(filledContainer());

        // Act
        const response = await controller.getOne(id);

        // Assert
        expect(response.body).toMatchObject({ id: id });
      }
    );
    test("with unknown id should throw", () => {
      // Arrange
      const controller = new SongsController(filledContainer());

      // Act
      const response = controller.getOne(" ");

      // Assert
      expect(response).rejects.toMatchObject({ code: 404 });
    });
  });

  describe("POST: /songs", () => {
    describe("with valid input", async () => {
      // Arrange
      const titles = [ "Tytuł", "lagiewnik", "1 kadrowa", "1948" ];
      const controller = new SongsController(filledContainer());
      let response: Response<unknown> | undefined;
      it("should return added song", async () => {
        // Act
        response = await controller.create({
          titles        : titles,
          authorIds     : [],
          textAuthorIds : [],
        });

        // Assert
        expect(response.body).toMatchObject({
          id          : expect.any(String),
          titles      : titles,
          authors     : [],
          textAuthors : [],
        });
      });

      it.skipIf(response == undefined)("should be preserved", async () => {
        // Act
        // const readResponse = await controller.getOne(response.body.songId);
        // Assert
        /* expect(readResponse.body).toMatchObject({
          id          : response.body.songId,
          titles      : titles,
          authors     : [],
          textAuthors : []
        }); */
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

    test("with titles prop is undefined should throw", async () => {
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

    test("with invalid author id", async () => {
      // Arrange
      const titles: string[] = [ "testowa" ];
      const controller = new SongsController(filledContainer());

      // Act
      const response = controller.create({
        titles        : titles,
        authorIds     : [ "#inva-lid" ],
        textAuthorIds : [],
      });

      // Assert
      await expect(response).rejects.toMatchObject({ code: 422 });
    });

    test("with invalid text author id", async () => {
      // Arrange
      const titles: string[] = [ "testowa" ];
      const controller = new SongsController(filledContainer());

      // Act
      const response = controller.create({
        titles        : titles,
        authorIds     : [],
        textAuthorIds : [ "#inva-lid" ],
      });

      // Assert
      await expect(response).rejects.toMatchObject({ code: 422 });
    });
  });
});
