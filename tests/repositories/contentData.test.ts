import { randomUUID } from "crypto";
import { mkdirSync } from "fs";
import { describe, expect, it } from "vitest";

import { ContentData, IContentDataRepository } from "../../src/repositories/ContentData/ContentDataRepository.abstract";
import { DummyContentDataRepository } from "../../src/repositories/ContentData/ContentDataRepository.dummy";
import { FilesystemContentDataRepository } from "../../src/repositories/ContentData/ContentDataRepository.filesystem";
import { CoreNote, PartType } from "../../src/repositories/ContentData/Parts";

const runPath = `./run/${randomUUID()}`;
mkdirSync(runPath, { recursive: true });

describe.each([
  { name: "Filesystem", repo: new FilesystemContentDataRepository(runPath) },
  { name: "Dummy", repo: new DummyContentDataRepository() }
])("$name Authors Repo", ({ repo }: { repo: IContentDataRepository }) => {
  describe("with correct data", () => {

    // Arrange
    const validId = "id";
    const validContent : ContentData = [
      {
        type  : PartType.Verse,
        lines : [
          {
            text   : "text",
            chords : [
              {
                coreNote : CoreNote.a,
                isMinor  : false
              }
            ]
          },
          {
            text   : "text2",
            chords : [
              {
                coreNote : CoreNote.a,
                isMinor  : false
              }
            ]
          }
        ]
      },
      {
        type  : PartType.Chorus,
        lines : [
          {
            text   : "text",
            chords : [
              {
                coreNote : CoreNote.a,
                isMinor  : false
              }
            ]
          },
          {
            text   : "text2",
            chords : [
              {
                coreNote : CoreNote.a,
                isMinor  : false
              }
            ]
          }
        ]
      }
    ];

    it("should create", async () => {
      // Act
      const res = await repo.saveContent(validId, validContent);

      // Assert
      expect(res).toBe(validId);
    });

    it("should read", async () => {
      // Act
      const res = await repo.readContent(validId);

      // Assert
      expect(res).toEqual(validContent);
    });
  });
});
