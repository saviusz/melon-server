import { SongMeta } from "../models/Song";

export interface SongService {
  getMetaList(): SongMeta[];
}
