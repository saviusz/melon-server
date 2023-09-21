import { Part } from "./Parts";
import { User } from "./User";

export class VersionedContent {
  constructor(
    public readonly id: String,
    public readonly name: String,
    public readonly author: User,
    public readonly parts: Part[]
  ) {}
}
