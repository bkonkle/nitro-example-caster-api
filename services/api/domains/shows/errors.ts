import { DomainError } from "../errors";

export class MissingProfileError extends DomainError {
  name = "MissingProfileError";

  constructor() {
    super("User object did not come with a Profile");
  }
}
