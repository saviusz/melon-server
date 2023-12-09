
import { ITitlesRepository } from "./TitlesRepository.abstract";

export class DummyTitlesRepository implements ITitlesRepository {

  add(songId: string, title: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  addMany(songId: string, titles: string[]): Promise<string[]> {
    throw new Error("Method not implemented.");
  }

  async getSongsIds(): Promise<string[]> {
    return [ "-----uuid1-----" ];
  }

  async getOnSong(songId: string): Promise<string[]> {
    return [ "Titles on", songId, "<-id" ];
  }

}
