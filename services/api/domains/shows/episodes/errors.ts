import { DomainError } from "../../errors";

export class BadRequestError extends DomainError {
  name = "BadRequestError";
}

export class ForbiddenError extends DomainError {
  name = "ForbiddenError";
}

export class NotFoundError extends DomainError {
  name = "NotFoundError";

  constructor(id: string) {
    super(`Episode with id ${id} not found`);
  }
}
