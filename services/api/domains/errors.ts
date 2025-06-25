export class DomainError implements Error {
  name = "DomainError";

  constructor(
    public message: string,
    public cause?: Error,
    public stack?: string
  ) {}
}

export class BadRequestError extends DomainError {
  name = "BadRequestError";
}

export class ForbiddenError extends DomainError {
  name = "ForbiddenError";
}

export class NotFoundError extends DomainError {
  name = "NotFoundError";

  constructor(entity: string, id: string) {
    super(`${entity} with id ${id} not found`);
  }
}
