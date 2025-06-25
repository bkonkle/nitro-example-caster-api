import type { CreateInput, UpdateInput, User } from "./model";
import type { UsersService } from "./service";

export class UsersController {
  constructor(private readonly service: UsersService) {}

  async getCurrentUser(_username: string, user?: User) {
    return user;
  }

  async getOrCreateCurrentUser(
    input: CreateInput,
    username: string,
    existing?: User
  ) {
    if (existing) {
      return { user: existing };
    }

    const user = await this.service.create({ ...input, username });

    return { user };
  }

  async updateCurrentUser(input: UpdateInput, existing: User) {
    const user = await this.service.update(existing.id, input);

    return { user };
  }
}
