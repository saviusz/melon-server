import { expect, test, vi } from "vitest";
import { listArtists } from "@services/artists/listArtists";

test("Shows empty list when no artists in db", async () => {
  const artistSelector = vi.fn().mockResolvedValue({ data: [], error: null });

  const res = await listArtists(artistSelector);
  expect(artistSelector).toBeCalled();
  expect(res.error).toBeNull();
  expect(res.data).toBeInstanceOf(Array);
  expect(res.data?.length).toBe(0);
});

test("Shows artists from db", async () => {
  const artistSelector = vi.fn().mockResolvedValue({
    data: [
      {
        id: 1,
        name: "John",
        pseudonym: "Doe",
        surname: null,
      },
      {
        id: 2,
        name: "Jane",
        pseudonym: null,
        surname: null,
      },
    ],
    error: null,
  });

  const res = await listArtists(artistSelector);
  expect(artistSelector).toBeCalled();
  expect(res.error).toBeNull();
  expect(res.data).toBeInstanceOf(Array);
  expect(res.data?.length).toBe(2);
  expect(res.data).toContainEqual({
    id: "1",
    name: "John",
    pseudonym: "Doe",
    surname: null,
  });
  expect(res.data).toContainEqual({
    id: "2",
    name: "Jane",
    pseudonym: null,
    surname: null,
  });
});
