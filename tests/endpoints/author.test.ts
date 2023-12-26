import { describe, expect, it } from "vitest";
import { AuthorsController } from "../../src/controllers/authorsController";
import ServiceContainer from "../../src/core/ServiceContainer";
import { SongService } from "../../src/services/SongsService";
import { DummyTitlesRepository } from "../../src/repositories/Titles/TitlesRepository.dummy";
import { AuthorService } from "../../src/services/AuthorsService";
import { DummyArtistsRepository } from "../../src/repositories/Artists/ArtistsRepository.dummy";
import { ContentService } from "../../src/services/ContentService";
import { DummyPartsRepository } from "../../src/repositories/Parts/PartsRepository.dummy";
import { DummyContentMetaRepository } from "../../src/repositories/ContentMeta/ContentMetaRepository.dummy";
import { Author } from "../../src/models/Author";
import { Response } from "../../src/core/Response";
import { DummyArtistRefsRepository } from "../../src/repositories/ArtistRefs/ArtistRefsRepository.dummy";


const emptyContainer = () => new ServiceContainer(
  new SongService(new DummyTitlesRepository()),
  new AuthorService(new DummyArtistsRepository(), new DummyArtistRefsRepository()),
  new ContentService(
    new DummyPartsRepository(),
    new DummyContentMetaRepository()
  )
);

const validAuthors = [
  new Author("--uid--", "name", "surname", "pseudonym"),
  new Author("9823494532", "Zażółć", "Jaźń", "" ),
  new Author("#-19%4$#!@", "Zażółć", "Jaźń", ""),
];

const filledContainer = () => new ServiceContainer(
  new SongService(new DummyTitlesRepository()),
  new AuthorService(
    new DummyArtistsRepository(validAuthors.map(x => ({
      authorId  : x.id,
      name      : x.name ?? "",
      pseudonym : x.pseudonym ?? "",
      surname   : x.surname ?? ""
    }))),
    new DummyArtistRefsRepository()
  ),
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
            name      : author.name ?? "",
            pseudonym : author.pseudonym ?? "",
            surname   : author.surname ?? ""
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

