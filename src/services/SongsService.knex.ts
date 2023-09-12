import { SongService } from "../interfaces/SongsService";
import { SongMeta } from "../models/Song";

export class SongKnexService implements SongService {
  getMetaList(): SongMeta[] {
    return [];
  }
}
