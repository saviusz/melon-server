import { Serializable } from "../helpers/Serializable";

export class Author extends Serializable {
    
    constructor (
    public readonly id: String,
    public readonly name?: String,
    public readonly surname?: String,
    public readonly pseudonym?: String){
        super();
    }

    toJson() {
        return {
            id: this.id,
            name: this.name || "",
            surname: this.surname || "",
            pseudonym: this.pseudonym || ""
        }
    }

    static fromJSON(obj) {
        
    }
}