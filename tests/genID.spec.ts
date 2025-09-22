import { expect, test, vi } from "vitest";

test("Id always ascends", async () => {
  vi.useFakeTimers();
  const { generateId } = await import("../lib/genID");

  let lastId = generateId();

  for (let i = 0; i < 1000; i += 0.1) {
    vi.advanceTimersByTime(i);
    const id = generateId();
    expect(id).toBeGreaterThan(lastId);
    lastId = id;
  }

  vi.useRealTimers();
});

test("Id overflows to the next second", async () => {
  vi.useFakeTimers();
  const { generateId } = await import("../lib/genID");

  let firstId = generateId();
  let currId = generateId();

  for (let i = 0; i < 1005; i++) {
    currId = generateId();
  }

  const firstSec = Math.floor((firstId % 10000) / 1000);
  const currSec = Math.floor((currId % 10000) / 1000);

  console.log(firstId);
  console.log(currId);

  expect(currId).toBeLessThanOrEqual(999999999999999);
  expect(currId).toBeGreaterThan(99999999999999);
  expect(firstSec).not.toBe(currSec);

  vi.useRealTimers();
});

test("Id numeration continues after overflow", async () => {
  vi.useFakeTimers();
  const { generateId } = await import("../lib/genID");

  console.log(generateId());
  let currId = generateId();

  for (let i = 0; i < 1005; i++) {
    currId = generateId();
  }

  vi.advanceTimersByTime(1000);
  const endId = generateId();

  expect(endId).toBeGreaterThan(currId);
  console.log(currId);
  console.log(endId);

  vi.useRealTimers();
});
