import { IArtistRefsRepository } from "./ArtistRefsRepository.abstract";

export class DummyArtistRefsRepository implements IArtistRefsRepository {

  authorsOnSongs = new Set<{
    songId   : string;
    authorId : string;
  }>();

  performersOnSongs = new Set<{
    songId   : string;
    authorId : string;
  }>();


  async addAuthorRef(songId: string, authorId: string): Promise<boolean> {
    return !!this.authorsOnSongs.add({ songId, authorId });
  }

  async addPerformerRef(songId: string, authorId: string): Promise<boolean> {
    return !!this.performersOnSongs.add({ songId, authorId });
  }

  async getAuthorsOnSong(songId: string): Promise<string[]> {
    return [ ...this.authorsOnSongs.values() ]
      .filter(x => x.songId == songId)
      .map(x => x.authorId);
  }

  async getPerformersOnSong(songId: string): Promise<string[]> {
    return [ ...this.performersOnSongs.values() ]
      .filter(x => x.songId == songId)
      .map(x => x.authorId);
  }

}
