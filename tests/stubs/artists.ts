import { ArtistDO } from "../../src/repositories/Artists/ArtistsRepository.abstract";
import { DummyArtistsRepository } from "../../src/repositories/Artists/ArtistsRepository.dummy";

export const validArtists: ArtistDO[] = [];

export const emptyArtistsRepo = () => new DummyArtistsRepository();

export const filledArtistsRepo = () => new DummyArtistsRepository(validArtists);
