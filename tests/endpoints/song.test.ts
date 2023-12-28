import { describe, expect, it, test } from "vitest";

import { SongsController } from "../../src/controllers/songsController";
import { Response } from "../../src/core/Response";
import ServiceContainer from "../../src/core/ServiceContainer";
import { Author } from "../../src/models/Author";
import { SongMeta } from "../../src/models/Song";
import { DummyArtistRefsRepository } from "../../src/repositories/ArtistRefs/ArtistRefsRepository.dummy";
import { DummyArtistsRepository } from "../../src/repositories/Artists/ArtistsRepository.dummy";
import { DummyContentDataRepository } from "../../src/repositories/ContentData/ContentDataRepository.dummy";
import { DummyContentMetaRepository } from "../../src/repositories/ContentMeta/ContentMetaRepository.dummy";
import { DummyTitlesRepository } from "../../src/repositories/Titles/TitlesRepository.dummy";
import { AuthorService } from "../../src/services/AuthorsService";
import { ContentService } from "../../src/services/ContentService";
import { SongService } from "../../src/services/SongsService";

const emptyContainer = () => new ServiceContainer(
  new SongService(new DummyTitlesRepository()),
  new AuthorService(new DummyArtistsRepository(), new DummyArtistRefsRepository()),
  new ContentService(
    new DummyContentDataRepository(),
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
  new AuthorService(new DummyArtistsRepository(validAuthors.map(x => ({
    authorId  : x.id,
    name      : x.name ?? "",
    pseudonym : x.pseudonym ?? "",
    surname   : x.surname ?? ""
  }))), new DummyArtistRefsRepository()),
  new ContentService(
    new DummyContentDataRepository(),
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
