export class Author {

  constructor(
    public readonly id: string,
    public readonly name: string | null,
    public readonly surname?: string | null,
    public readonly pseudonym?: string | null
  ) {}

}
