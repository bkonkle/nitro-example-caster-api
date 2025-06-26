import type { CreateInput, UpdateInput } from "./model";
import type { UsersService } from "./service";

export class UsersController {
  constructor(private readonly service: UsersService) {}

  async getUserByUsername(username: string) {
    const user = await this.service.getByUsername(username);

    return user;
  }

  async getOrCreateUser(username: string, input: CreateInput) {
    const existing = await this.service.getByUsername(username);
    if (existing) {
      return { user: existing };
    }

    const user = await this.service.create({ ...input, username });

    return { user };
  }

  async updateUser(id: string, input: UpdateInput) {
    const user = await this.service.update(id, input);

    return { user };
  }
}
