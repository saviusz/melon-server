import { ContentData } from "../repositories/ContentData/ContentDataRepository.abstract";
import { User } from "./User";

export class ContentMeta {

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly author: User
  ) {}

}

export class Content {

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly author: User,
    public readonly data: ContentData
  ) {}

}
