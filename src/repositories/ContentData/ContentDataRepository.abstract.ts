import { Part } from "./Parts";

export type ContentData = Part[];

export interface IContentDataRepository {

  /**
   * Saves provided version in datasource, eg. on disk or id db
   * @param identifier uniqe identifier in datasource, eg. filename or id
   * @param content data that we'd like to be saved
   */
  saveContent(identifier: string, content: ContentData) : Promise<string>;

  /**
   * Reads content data from datasource
   * @param identifier uniqe identifier in datasource, eg. filename or id
   */
  readContent(identifier: string) : Promise<ContentData>;
}
