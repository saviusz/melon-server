import { describe, expect, it, test } from "vitest";
import ServiceContainer from "../../src/core/ServiceContainer";
import { SongService } from "../../src/services/SongsService";
import { DummyTitlesRepository } from "../../src/repositories/Titles/TitlesRepository.dummy";
import { AuthorService } from "../../src/services/AuthorsService";
import { DummyAuthorsRepository } from "../../src/repositories/Authors/AuthorsRepository.dummy";
import { ContentService } from "../../src/services/ContentService";
import { DummyPartsRepository } from "../../src/repositories/Parts/PartsRepository.dummy";
import { DummyContentMetaRepository } from "../../src/repositories/ContentMeta/ContentMetaRepository.dummy";
import { SongsController } from "../../src/controllers/songsController";
import { Author } from "../../src/models/Author";
import { Response } from "../../src/core/Response";
import { SongMeta } from "../../src/models/Song";
import { KnexTitlesRepository } from "../../src/repositories/Titles/TitlesRepository.knex";
import { ITitlesRepository } from "../../src/repositories/Titles/TitlesRepository.abstract";
import Knex from "knex";
import knexfile from "../../knexfile";

describe.todo.each([
  { name: "Knex", repo: new KnexTitlesRepository(Knex(knexfile["test"])) },
  { name: "Dummy", repo: new DummyTitlesRepository() }
])("$name Titles Repo", ({ repo }: { repo: ITitlesRepository }) => {
  describe("when adding with valid data", () => {

    // TODO: Add this test

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

const validSongMetas = [
  new SongMeta("id", [ "Tytuł", "1948" ], [], []),
  new SongMeta("694202137", [ "lagiewnik", "1 kadrowa" ], [], [])
];


const validIds = [ "id", "694202137" ];
const validAuthors = [
  new Author("--uid--", "name", "surname", "pseudonym"),
  new Author("9823494532", "Zażółć", "Jaźń" ),
  new Author("#-19%4$#!@", "Zażółć", "Jaźń", ""),
];


function generateTitles() {
  const array = [];
  for(const meta of validSongMetas) {
    for(const title of meta.titles) array.push({ id: meta.songId, title });
  }
  return array;
}

const generatedTitles = generateTitles();

const filledContainer = () => new ServiceContainer(
  new SongService(new DummyTitlesRepository(generatedTitles)),
  new AuthorService(new DummyAuthorsRepository(validAuthors)),
  new ContentService(
    new DummyPartsRepository(),
    new DummyContentMetaRepository()
  )
);

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
      expect(response.body).toMatchObject(validSongMetas);
    });

  });

  describe("GET: /song/:id", () => {
    test.each(validIds)("with existing id '%s' should return song", async (id) => {
      // Arrange
      const controller = new SongsController(filledContainer());

      // Act
      const response = await controller.getOne(id);

      // Assert
      expect(response.body).toMatchObject({ id: id });
    });
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
      let response: Response<SongMeta> | undefined;
      it.sequential("should return added song", async () => {
      // Act
        response = await controller.create({
          titles        : titles,
          authorIds     : [],
          textAuthorIds : []
        });

        // Assert
        expect(response.body).toMatchObject({
          id          : expect.any(String),
          titles      : titles,
          authors     : [],
          textAuthors : []
        });
      });

      it.skipIf(response == undefined)("should be preserved", async () => {
      // Act
        const readResponse = await controller.getOne(response.body.songId);

        // Assert
        expect(readResponse.body).toMatchObject({
          id          : response.body.songId,
          titles      : titles,
          authors     : [],
          textAuthors : []
        });
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
        textAuthorIds : []
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
        titles        : titles,
        authorIds     : [],
        textAuthorIds : []
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
        textAuthorIds : []
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
        textAuthorIds : []
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
        textAuthorIds : [ "#inva-lid" ]
      });

      // Assert
      await expect(response).rejects.toMatchObject({ code: 422 });
    });
  });
});
