import { DummyTitlesRepository } from "../../src/repositories/Titles/TitlesRepository.dummy";

export const validTitles = {
  "----uuid1-----"    : [ "test" ],
  "328dfsxzcbhtemjdf" : [ "żabądź ze spacją" ]
};

export const emptyTitlesRepo = () => new DummyTitlesRepository();

export const filledTitlesRepo = () => new DummyTitlesRepository(validTitles);
