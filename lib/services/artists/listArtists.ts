import { ArtistSelector } from "../../drivers/artists";
import { Result } from "../../Result";
import { Artist } from "./Artist";

export async function listArtists(
  getArtists: ArtistSelector,
): Result<Artist[], unknown> {
  const res = await getArtists();
  if (res.error)
    return {
      data: null,
      error: "Couldn't retrive Artists",
    };

  const artists: Artist[] = res.data!.map((row) => {
    return {
      id: row.id.toString(),
      name: row.name,
      surname: row.surname,
      pseudonym: row.pseudonym,
    };
  });

  return {
    data: artists,
    error: null,
  };
}
