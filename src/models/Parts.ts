export enum PartType {
  Note = "note",
  Bridge = "bridge",
  Verse = "verse",
  Chorus = "chorus",
  Ornament = "ornament"
}

export function getPartType(value: string) {
  switch (value) {

    case "bridge":
      return PartType.Bridge;

    case "verse":
      return PartType.Verse;

    case "chorus":
      return PartType.Chorus;

    case "ornament":
      return PartType.Ornament;

    case "note":
    default:
      return PartType.Note;

  }
}


export class Part {

  constructor(
    public readonly type: PartType,
    public readonly lines: Line[],
    public readonly name?: string
  ) {
  }

}

export class Line {

  constructor(
    public readonly text: string,
    public readonly chords: Chord[]
  ) {}

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

export class Chord {

  constructor(
    public readonly coreNote: CoreNote,
    public readonly isMinor: boolean
  ) {}

}
