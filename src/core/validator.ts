class ValidationResult {

  constructor(
    public readonly id      : string,
    public readonly isValid : boolean,
    public readonly message : string | null = null
  ) {}

}

type Predicate = (data: unknown) => boolean;

export class Validator {

  private checks  : ((data: unknown) => ValidationResult)[] = [];
  private results : Array<ValidationResult> = [];

  getResults(data: unknown) {
    this.results = [];
    for (const check of this.checks) {
      this.results.push(check(data));
    }
    return this.results;
  }

  getFails(data: unknown) {
    this.results = [];
    for (const check of this.checks) {
      const result = check(data);
      if(!result.isValid) this.results.push(result);
    }
    return this.results;
  }

  test(data: unknown) {
    for (const check of this.checks) {
      const result = check(data);
      if(!result.isValid) return false;
    }
    return true;
  }

  private usePrev(id: string) {
    return this.results.reverse().find(res => res.id == id);
  }

  check(predicate: Predicate, message: string = "Custom check failed", id: string = "custom") {
    const newFunciton = (data: unknown) => {

      const result = predicate(data);
      return new ValidationResult(
        id,
        result,
        result ? null : message
      );
    };

    this.checks.push(newFunciton);
    return this;

  }

  isDefined(message = "Must be defined") {
    const isDefined = (data: unknown) => typeof data !== "undefined";
    return this.check(isDefined, message, "defined");
  }

  isString(message = "Must be a string") {
    const isString = (data: unknown) => typeof data === "string" || data == undefined;
    return this.check(isString, message, "string" );
  }

  isNumber(message = "Must be a number") {
    const isNumber = (data: unknown) => typeof data === "number" || data == undefined;
    return this.check(isNumber, message, "number");
  }

  isArray(message = "Must be an array") {
    const isArray = (data: unknown) => Array.isArray(data) || data == undefined;
    return this.check(isArray, message, "array");
  }

  isNotEmpty(message = "Must not be empty") {
    if(!(this.usePrev("array") || this.usePrev("string"))) return this;
    const isNotEmpty = (data: unknown) => (data as (string | Array<unknown>)).length > 0;
    return this.check(isNotEmpty, message);
  }

}
