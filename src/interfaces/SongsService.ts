import { Song, SongMeta } from "../models/Song";
import { Service } from "./Service";

export interface SongService extends Service {
  getMetaList(): SongMeta[];
  getMeta(id: string): Promise<SongMeta>;
  getIds(): Promise<string[]>;
  getSong(id: string): Promise<Song>;
}
