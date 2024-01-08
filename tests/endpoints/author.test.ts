import { describe, expect, it } from "vitest";

import { AuthorsController } from "../../src/controllers/authorsController";
import { Response } from "../../src/core/Response";
import { Author } from "../../src/models/Author";
import { filledArtistsRepo, validArtists } from "../stubs/artists";
import { emptyContainer, partialContainer } from "../stubs/serviceContainer";

const filledContainer = () =>
  partialContainer({ artistRepo: filledArtistsRepo() });

describe("Authors data", () => {
  describe("GET: /authors", () => {
    it("on empty database should return empty response", async () => {
      // Arrange
      const controller = new AuthorsController(emptyContainer());

      // Act
      const response = await controller.getMultiple();

      // Assert
      expect(response.body).toHaveLength(0);
    });

    it("on filled database should return authors", async () => {
      // Arrange
      const controller = new AuthorsController(filledContainer());

      // Act
      const response = await controller.getMultiple();

      // Assert
      expect(response.body).toHaveLength(validArtists.length);
      expect(response.body).toEqual(validArtists);
    });
  });

  describe("GET: /authors/:id", () => {
    it.each(validArtists)(
      "on existing id $id should return author with $id id",
      async (artist) => {
        // Arrange
        const controller = new AuthorsController(filledContainer());

        // Act
        const response = await controller.getOne(artist.id);

        // Assert
        expect(response.body).toEqual(artist);
      }
    );

    it.each(validArtists)(
      "on non existent id $id should return 404",
      async (artist) => {
        // Arrange
        const controller = new AuthorsController(emptyContainer());

        // Act
        const response = controller.getOne(artist.id);

        // Assert
        expect(response).rejects.toMatchObject({ code: 404 });
      }
    );
  });

  describe("POST: /authors", () => {
    describe.each(validArtists)(
      "on Author($name, $pseudonym, $surname)",
      async (author) => {
        // Arrange
        const controller = new AuthorsController(emptyContainer());
        let response: Response<Author> | undefined;

        it("should return Author($name, $pseudonym, $surname)", async () => {
          // Act
          response = await controller.create({
            name      : author.name ?? "",
            pseudonym : author.pseudonym ?? "",
            surname   : author.surname ?? "",
          });

          // Assert
          expect(response.body).toMatchObject({
            id        : expect.any(String),
            name      : author.name,
            pseudonym : author.pseudonym,
            surname   : author.surname,
          });
          expect(response.status).toBe(201);
        });

        it("should be preserved", async () => {
          // Act
          const readResponse = await controller.getOne(response!.body.id);

          // Assert
          expect(readResponse.body).toMatchObject({
            id        : expect.any(String),
            name      : author.name,
            pseudonym : author.pseudonym,
            surname   : author.surname,
          });
        });
      }
    );

    it("on empty strings input should throw", async () => {
      // Arrange
      const controller = new AuthorsController(emptyContainer());

      // Act
      const response = controller.create({
        name      : "",
        surname   : "",
        pseudonym : "",
      });

      // Assert
      await expect(response).rejects.toMatchObject({ code: 422 });
    });

    it.each(validArtists)(
      "on existing author with id $id should throw",
      async (artist) => {
        // Arrange
        const controller = new AuthorsController(filledContainer());

        // Act
        const response = controller.create({
          name      : artist.name,
          surname   : artist.surname,
          pseudonym : artist.pseudonym,
        });

        // Assert
        await expect(response).rejects.toMatchObject({ code: 303 });
      }
    );
  });
});
