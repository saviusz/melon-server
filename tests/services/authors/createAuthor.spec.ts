import { createAuthor } from "@services/authors/createAuthor";
import { beforeEach, expect, Mock, test, vi } from "vitest";
import { AuthorInserter } from "../../../lib/drivers/authors";

let authorInserter: Mock<AuthorInserter>;
const stubRow = {
  id: "stubId",
  name: "stubName",
  pseudonym: "stubPseudo",
  surname: "stubSurname",
};

beforeEach(() => {
  authorInserter = vi.fn<AuthorInserter>().mockResolvedValue({
    error: null,
    data: stubRow,
  });
});

test("Create with data", async () => {
  const data = {
    name: "John",
    pseudonym: "Guy",
    surname: "Doe",
  };

  const result = await createAuthor(data, authorInserter);
  expect(result.error).toBe(null);
  expect(authorInserter).toBeCalledWith({
    id: expect.any(String),
    ...data,
  });
  expect(result.data).toMatchObject(stubRow);
});

test("Created Authors have different ID", async () => {
  const data = {
    name: "John",
    pseudonym: "Guy",
    surname: "Doe",
  };

  await createAuthor(data, authorInserter);
  const call1 = authorInserter.mock.lastCall;

  await createAuthor(data, authorInserter);
  expect(authorInserter.mock.lastCall?.[0].id).not.toBe(call1?.[0].id);
});

test.each([null, undefined])("Error on no data (%s)", async (stub) => {
  const data = {
    name: stub,
    pseudonym: stub,
    surname: stub,
  };

  const result = await createAuthor(data, authorInserter);
  expect(result.error).not.toBe(null);
});

test("Error on db error", async () => {
  authorInserter = vi.fn().mockResolvedValue({
    data: null,
    error: "mock error",
  });
  const data = {
    name: "John",
    pseudonym: "Guy",
    surname: null,
  };

  const result = await createAuthor(data, authorInserter);
  expect(result.error).not.toBe(null);
});
