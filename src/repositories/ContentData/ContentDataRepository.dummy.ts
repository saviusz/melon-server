import { logger } from "../../core/Logger/Logger";
import { IContentDataRepository } from "./ContentDataRepository.abstract";
import { Part } from "./Parts";

export class DummyContentDataRepository implements IContentDataRepository {

  private storage = new Map();

  async readContent(id: string): Promise<Part[]> {
    logger.warn("Using dummy content source");
    return this.storage.get(id);
  }

  async saveContent(identifier: string, content: Part[]): Promise<string> {
    this.storage.set(identifier, content);
    return identifier;
  }

}
