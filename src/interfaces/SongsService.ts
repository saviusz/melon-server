import { SongMeta } from "../models/Song";

export interface SongService {
  getMetaList(): SongMeta[];
  getMeta(id: string): Promise<SongMeta>;
  getIds(): Promise<string[]>;
}
