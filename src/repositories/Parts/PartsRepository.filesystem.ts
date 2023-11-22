import { readFile } from "fs/promises";
import { Part } from "../../models/Parts";
import { IPartsRepository } from "./PartsRepository.abstract";

export class FilesystemPartsRepository implements IPartsRepository {

  private baseDir = "./data/songs";

  async getContentByFilename(filename: string): Promise<Part[]> {
    const file = await readFile(`${this.baseDir}/${filename}`, { encoding: "utf8" });
    const parts : Part[] =  JSON.parse(file);
    return parts;
  }

}
