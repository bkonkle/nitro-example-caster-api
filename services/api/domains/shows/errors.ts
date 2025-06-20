import { DomainError } from "../errors";

export class MissingProfileError extends DomainError {
  name = "MissingProfileError";
}

export class ForbiddenError extends DomainError {
  name = "ForbiddenError";
}

export class ShowNotFoundError extends DomainError {
  name = "ShowNotFoundError";

  constructor(id: string) {
    super(`Show with id ${id} not found`);
  }
}
