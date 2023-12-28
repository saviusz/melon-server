import { readFile, writeFile } from "fs/promises";

import { ContentData, IContentDataRepository } from "./ContentDataRepository.abstract";
import { Part } from "./Parts";

export class FilesystemContentDataRepository implements IContentDataRepository {

  constructor(private baseDir : string) {}

  async readContent(filename: string): Promise<Part[]> {
    const file = await readFile(`${this.baseDir}/${filename}`, { encoding: "utf8" });
    const parts : ContentData =  JSON.parse(file);
    return parts;
  }

  async saveContent(identifier: string, content: Part[]): Promise<string> {
    const contentText = JSON.stringify(content);
    await writeFile(`${this.baseDir}/${identifier}`, contentText, { encoding: "utf8" });
    return identifier;
  }

}
