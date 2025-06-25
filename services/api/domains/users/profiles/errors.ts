import { DomainError } from "../../errors";

export class ForbiddenError extends DomainError {
  name = "ForbiddenError";
}

export class NotFoundError extends DomainError {
  name = "NotFoundError";

  constructor(id: string) {
    super(`Profile with id ${id} not found`);
  }
}
