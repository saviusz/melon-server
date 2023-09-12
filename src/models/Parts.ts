import { Serializable } from "../helpers/Serializable";

export enum PartType {
    Note = "note",
    Bridge = "bridge",
    Verse = "verse",
    Chorus = "chorus",
    Ornament = "ornament"
}


export class Part extends Serializable {
    constructor(
        public readonly type: PartType,
        public readonly lines: Line[],
        public readonly name?: String) {
        super();
    }

    toJson() {
        return {
            type: this.type,
            lines: this.lines.map(line => line.toJson()),
            name: this.name ?? ""
        }
    }

    static fromJSON(obj) {
        if ("type" in obj == false) throw new Error("Missing type in VersionedContent json");
        if ("lines" in obj == false) throw new Error("Missing 'lines' field in VersionedContent json");

        return new Part(PartType[obj.type], obj.lines.map(x => Line.fromJSON(x)), obj.name)
    }
}

export class Line extends Serializable {
    constructor(
        public readonly text: String,
        public readonly chords: Chord[]
    ) {
        super()
    }

    toJson() {
        return {
            text: this.text,
            chords: this.chords.map(x => x.toJson())
        }
    }

    static fromJSON(obj) {
        if ("text" in obj == false) throw new Error("Missing text in Line json");
        if ("chords" in obj == false) throw new Error("Missing chords in Chord json");

        return new Line(
            obj.text,
            obj.chords.map(x => Chord.fromJSON(x))
        )
    }
}

export enum CoreNote {
    a = "a",
    b = "b",
    h = "h",
    c = "c",
    d = "d",
    e = "e",
    f = "f",
    g = "g",
}

export class Chord extends Serializable {
    constructor(
        public readonly coreNote: CoreNote,
        public readonly isMinor: boolean
    ) {
        super()
    }

    toJson() {
        return {
            core: this.coreNote,
            isMinor: this.isMinor
        }
    }

    static fromJSON(obj) {
        if ("core" in obj == false) throw new Error("Missing core in Chord json");
        if ("isMinor" in obj == false) throw new Error("Missing is-minor in Chord json");

        return new Chord(CoreNote[obj.core], obj.isMinor)
    }
}