import { Part } from "../../models/Parts";

export interface IPartsRepository {
  getContentByFilename(filename: string) : Promise<Array<Part>>;
}
