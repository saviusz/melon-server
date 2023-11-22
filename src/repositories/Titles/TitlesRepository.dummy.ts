
import { ITitlesRepository } from "./TitlesRepository.abstract";

export class DummyTitlesRepository implements ITitlesRepository {

  async getSongsIds(): Promise<string[]> {
    return [ "-----uuid1-----" ];
  }

  async getOnSong(songId: string): Promise<string[]> {
    return [ "Titles on", songId, "<-id" ];
  }

}
