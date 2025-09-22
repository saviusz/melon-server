import { createArtist } from "@services/artists/createArtist";
import { beforeEach, expect, Mock, test, vi } from "vitest";
import { ArtistInserter } from "../../../lib/drivers/artists";

let artistInserter: Mock<ArtistInserter>;
const stubRow = {
  id: "69420",
  name: "stubName",
  pseudonym: "stubPseudo",
  surname: "stubSurname",
};

beforeEach(() => {
  artistInserter = vi.fn<ArtistInserter>().mockResolvedValue({
    error: null,
    data: {
      ...stubRow,
      id: 69420,
    },
  });
});

test("Create with data", async () => {
  const data = {
    name: "John",
    pseudonym: "Guy",
    surname: "Doe",
  };

  const result = await createArtist(data, artistInserter);
  expect(result.error).toBe(null);
  expect(artistInserter).toBeCalledWith({
    id: expect.any(Number),
    ...data,
  });
  expect(result.data).toMatchObject(stubRow);
});

test("Created Artists have different ID", async () => {
  const data = {
    name: "John",
    pseudonym: "Guy",
    surname: "Doe",
  };

  await createArtist(data, artistInserter);
  const call1 = artistInserter.mock.lastCall;

  await createArtist(data, artistInserter);
  expect(artistInserter.mock.lastCall?.[0].id).not.toBe(call1?.[0].id);
});

test.each([null, undefined])("Error on no data (%s)", async (stub) => {
  const data = {
    name: stub,
    pseudonym: stub,
    surname: stub,
  };

  const result = await createArtist(data, artistInserter);
  expect(result.error).not.toBe(null);
});

test("Error on db error", async () => {
  artistInserter = vi.fn().mockResolvedValue({
    data: null,
    error: "mock error",
  });
  const data = {
    name: "John",
    pseudonym: "Guy",
    surname: null,
  };

  const result = await createArtist(data, artistInserter);
  expect(result.error).not.toBe(null);
});
