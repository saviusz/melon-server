import { Author } from "../../src/models/Author";
import { ArtistDO } from "../../src/repositories/Artists/ArtistsRepository.abstract";
import { DummyArtistsRepository } from "../../src/repositories/Artists/ArtistsRepository.dummy";

export const validArtists: Author[] = [
  new Author("--uid--", "name", "surname", "pseudonym"),
  new Author("9823494532", "Zażółć", "Jaźń", ""),
  new Author("#-19%4$#!@", "Zażółć", "Jaźń", ""),
];

export const emptyArtistsRepo = () => new DummyArtistsRepository();

export const filledArtistsRepo = () =>
  new DummyArtistsRepository(
    validArtists.map<ArtistDO>((x) => ({
      authorId  : x.id,
      name      : x.name ?? null,
      pseudonym : x.pseudonym ?? null,
      surname   : x.surname ?? null,
    }))
  );
