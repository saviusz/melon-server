import { Serializable } from "../helpers/Serializable";

export class User extends Serializable {
    constructor(
        public readonly id: String,
        public readonly username: String) {
        super()
    }

    toJson() {
        return {
            id: this.id,
            username: this.username
        }
    }

    static fromJson(obj) {
        if ("id" in obj == false) throw new Error("Missing id in User json");
        if ("username" in obj == false) throw new Error("Missing username in User json");


        return new User(
            obj.id,
            obj.username
        );
    }
}