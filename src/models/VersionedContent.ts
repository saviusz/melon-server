import { Part } from "./Parts";
import { User } from "./User";

export class VersionedContentMeta {

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly author: User
  ) {}

}

export class VersionedContent {

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly author: User,
    public readonly parts: Part[]
  ) {}

}
