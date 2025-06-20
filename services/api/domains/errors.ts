export class DomainError implements Error {
  name = "DomainError";

  constructor(
    public message: string,
    public cause?: Error,
    public stack?: string
  ) {}
}
