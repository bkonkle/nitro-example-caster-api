import type { Prisma, PrismaClient } from "@prisma/client";
import { getOffset, paginateResponse } from "@caster/responses/pagination";
import { omit } from "lodash-es";

import type { CreateInput, UpdateInput } from "./model";

export class ProfilesService {
  constructor(private readonly prisma: PrismaClient) {}

  async get(id: string) {
    return this.prisma.profile.findFirst({
      include: { user: true },
      where: { id },
    });
  }

  async getMany(options: {
    where: Prisma.ProfileWhereInput | undefined;
    orderBy: Prisma.ProfileOrderByWithRelationInput | undefined;
    pageSize?: number;
    page?: number;
  }) {
    const { pageSize, page, ...rest } = options;

    const total = await this.prisma.profile.count(rest);
    const profiles = await this.prisma.profile.findMany({
      include: { user: true },
      ...rest,
      ...getOffset(pageSize, page),
    });

    return paginateResponse(profiles, {
      total,
      pageSize,
      page,
    });
  }

  async create(input: CreateInput) {
    return this.prisma.profile.create({
      include: { user: true },
      data: {
        ...omit(input, "userId"),
        user: {
          connect: { id: input.userId },
        },
      },
    });
  }

  async update(id: string, input: UpdateInput) {
    const data = input.userId
      ? omit(
          {
            ...input,
            user: {
              connect: { id: input.userId },
            },
          },
          ["userId"]
        )
      : input;

    return this.prisma.profile.update({
      include: { user: true },
      where: { id },
      data: data,
    });
  }

  async delete(id: string) {
    return this.prisma.profile.delete({
      include: { user: true },
      where: { id },
    });
  }
}
