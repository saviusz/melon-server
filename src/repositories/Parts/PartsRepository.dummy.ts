import { logger } from "../../core/Logger/Logger";
import { Line, Part, PartType } from "../../models/Parts";
import { IPartsRepository } from "./PartsRepository.abstract";

export class DummyPartsRepository implements IPartsRepository {

  async getContentByFilename(filename: string): Promise<Part[]> {
    logger.warn("Using dummy content source");
    return (
      [
        new Part(PartType.Verse, [
          new Line("This is dummy verse", []),
          new Line(`For dummy file: ${filename}`, [])
        ]),
        new Part(PartType.Chorus, [
          new Line("This is dummy chorus", []),
          new Line(`For dummy file: ${filename}`, [])
        ]),
      ]);
  }

}
