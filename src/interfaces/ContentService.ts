import { VersionedContent } from "../models/VersionedContent";

export interface ContentService {
  getById(id: string): Promise<VersionedContent>;
}
