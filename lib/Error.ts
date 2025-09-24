export abstract class MelonError {
  abstract readonly ErrorID: string;
  constructor(
    private readonly message: string,
    private readonly error: unknown,
  ) {}
}
