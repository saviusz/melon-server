import ShortUniqueId from "short-unique-id";

const idGen = new ShortUniqueId({ length: 7 });
export abstract class Problem {

  abstract readonly code: number;
  abstract readonly type : string;
  abstract readonly title: string;
  abstract readonly detail?: string;
  extensions        : object = {};
  readonly instance : string = idGen.randomUUID();

  getFormatted() {
    return {
      type     : this.type,
      title    : this.title,
      detail   : this.detail,
      instance : this.instance,
      ...this.extensions
    };
  }

}
