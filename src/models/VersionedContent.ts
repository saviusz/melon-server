import { Serializable } from "../helpers/Serializable";
import { Part } from "./Parts";
import { User } from "./User";

export class VersionedContent extends Serializable {
    constructor(
        public readonly id: String,
        public readonly name: String,
        public readonly author: User,
        public readonly parts: Part[]
    ) {
        super()
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            author: this.author.toJson,
            parts: this.parts.map(part => part.toJson())
        }
    }

    static fromJSON(obj) {
        if ("id" in obj == false) throw new Error("Missing id in VersionedContent json");
        if ("name" in obj == false) throw new Error("Missing name in VersionedContent json");
        if ("author" in obj == false) throw new Error("Missing author in VersionedContent json");
        if ("parts" in obj == false) throw new Error("Missing 'parts' field in VersionedContent json");

        return new VersionedContent(
            obj.id,
            obj.name,
            User.fromJson(obj.author),
            obj.parts.map(x => Part.fromJSON(x))
        )
    }
}