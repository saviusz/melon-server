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


export interface Part {
  type  : PartType;
  lines : Line[];
  name? : string;
}

export interface Line {
  text   : string;
  chords : Chord[];
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

export interface Chord {
  coreNote : CoreNote;
  isMinor  : boolean;
}
