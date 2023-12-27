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
import { Response } from "../../src/core/Response";
import { KnexAuthorsRepository } from "../../src/repositories/Authors/AuthorsRepository.knex";
import Knex from "knex";
import knexfile from "../../knexfile";
import { IAuthorsRepository } from "../../src/repositories/Authors/AuthorsRepository.abstract";

describe.each([
  { name: "Knex", repo: new KnexAuthorsRepository(Knex(knexfile["test"])) },
  { name: "Dummy", repo: new DummyAuthorsRepository() }
])("$name Authors Repo", ({ repo }: { repo: IAuthorsRepository }) => {
  describe("when adding with valid data", () => {
    let valid: Author;
    it("should create", async () => {
      valid = await repo.addOne({
        name      : "Imie",
        pseudonym : "Pseudonym",
        surname   : "Nazwisko"
      });
    });

    it("should be readeble", async () => {
      // Act
      const response = await repo.getOneById(valid.id);

      // Assert
      expect(response).toBe(valid);
    });

    it("should be displayed in all authors", async () => {
      // Act
      const response = await repo.getMultiple();

      // Assert
      expect(response).toContainEqual(valid);
    });

  });
});

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
    describe.each(validAuthors)(
      "on Author($name, $pseudonym, $surname)",
      async (author) => {
        // Arrange
        const controller = new AuthorsController(emptyContainer());
        let response: Response<Author> | undefined;

        it("should return Author($name, $pseudonym, $surname)", async () => {

          // Act
          response = await controller.create({
            name      : author.name,
            pseudonym : author.pseudonym,
            surname   : author.surname
          });

          // Assert
          expect(response.body).toMatchObject(
            {
              id        : expect.any(String),
              name      : author.name,
              pseudonym : author.pseudonym,
              surname   : author.surname
            }
          );
        });

        it("should be preserved", async () => {

          // Act
          const readResponse = await controller.getOne(response.body.id);

          // Assert
          expect(readResponse.body).toMatchObject(
            {
              id        : expect.any(String),
              name      : author.name,
              pseudonym : author.pseudonym,
              surname   : author.surname
            }
          );
        });
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

