import { describe, expect, it } from "vitest";
import { AuthorsController } from "../../src/controllers/authorsController";
import ServiceContainer from "../../src/core/ServiceContainer";
import { SongService } from "../../src/services/SongsService";
import { DummyTitlesRepository } from "../../src/repositories/Titles/TitlesRepository.dummy";
import { AuthorService } from "../../src/services/AuthorsService";
import { DummyAuthorsRepository } from "../../src/repositories/Authors/AuthorsRepository.dummy";
import { ContentService } from "../../src/services/ContentService";
import { DummyPartsRepository } from "../../src/repositories/Parts/PartsRepository.dummy";
import { DummyContentMetaRepository } from "../../src/repositories/ContentMeta/ContentMetaRepository.dummy";
import { Author } from "../../src/models/Author";

const emptyContainer = () => new ServiceContainer(
  new SongService(new DummyTitlesRepository()),
  new AuthorService(new DummyAuthorsRepository()),
  new ContentService(
    new DummyPartsRepository(),
    new DummyContentMetaRepository()
  )
);

const validAuthors = [
  new Author("--uid--", "name", "surname", "pseudonym"),
  new Author("9823494532", "Zażółć", "Jaźń" ),
  new Author("#-19%4$#!@", "Zażółć", "Jaźń", ""),
];

const filledContainer = () => new ServiceContainer(
  new SongService(new DummyTitlesRepository()),
  new AuthorService(new DummyAuthorsRepository(validAuthors)),
  new ContentService(
    new DummyPartsRepository(),
    new DummyContentMetaRepository()
  )
);

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
      expect(response.body).toHaveLength(validAuthors.length);
      expect(response.body).toEqual(validAuthors);
    });
  });

  describe("GET: /authors/:id", () => {
    it.each(validAuthors)("on $id should return author with $id id", async (author) => {
      // Arrange
      const controller = new AuthorsController(filledContainer());

      // Act
      const response = await controller.getOne(author.id);

      // Assert
      expect(response.body).toHaveProperty("id", author.id);
      expect(response.body).toEqual(author);
    });
  });

  describe("POST: /authors", () => {
    it.each(validAuthors)(
      "on Author($name, $pseudonym, $surname) should create and return same correct author",
      async (author) => {
        // Arrange
        const controller = new AuthorsController(emptyContainer());

        // Act
        const response = await controller.create({
          name      : author.name,
          pseudonym : author.pseudonym,
          surname   : author.surname
        });

        // Assert
        expect(response.body).toHaveProperty("id");
        expect(response.body).toMatchObject(
          {
            id        : expect.any(String),
            name      : author.name,
            pseudonym : author.pseudonym,
            surname   : author.surname
          }
        );
      }
    );

    it("on empty input should throw", async () => {
      // Arrange
      const controller = new AuthorsController(emptyContainer());

      // Act
      const response = controller.create({});

      // Assert
      await expect(response).rejects.toMatchObject({ code: 422 });
    });

    it("on empty strings input should throw", async () => {
      // Arrange
      const controller = new AuthorsController(emptyContainer());

      // Act
      const response = controller.create({
        name      : "",
        surname   : "",
        pseudonym : ""
      });

      // Assert
      await expect(response).rejects.toMatchObject({ code: 422 });
    });

    it.todo("on existing author should throw");
  });
});
