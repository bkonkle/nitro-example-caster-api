import type { PrismaClient } from "@prisma/client";

import type { CreateInput, UpdateInput } from "./model";

export class UsersService {
  constructor(private readonly prisma: PrismaClient) {}

  async get(id: string) {
    return this.prisma.user.findFirst({
      include: { profile: true },
      where: { id },
    });
  }

  async getByUsername(username: string) {
    return this.prisma.user.findFirst({
      include: { profile: true },
      where: { username },
    });
  }

  async create(input: CreateInput & { username: string }) {
    return this.prisma.user.create({
      include: { profile: true },
      data: {
        ...input,
        profile: input.profile
          ? {
              create: input.profile,
            }
          : undefined,
      },
    });
  }

  async update(id: string, input: UpdateInput) {
    return this.prisma.user.update({
      include: { profile: true },
      where: { id },
      data: {
        username: input.username || undefined,
        isActive: input.isActive === null ? undefined : input.isActive,
      },
    });
  }
}
