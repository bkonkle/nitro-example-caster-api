import type { Prisma, PrismaClient } from "@prisma/client";
import {
  type ManyResponse,
  getOffset,
  paginateResponse,
} from "@caster/responses/pagination";
import type { Show, CreateInput, UpdateInput } from "./model";

export class ShowsService {
  constructor(private readonly prisma: PrismaClient) {}

  async get(id: string): Promise<Show | null> {
    return this.prisma.show.findFirst({
      where: { id },
    });
  }

  async list(options: {
    where: Prisma.ShowWhereInput | undefined;
    orderBy: Prisma.ShowOrderByWithRelationInput | undefined;
    pageSize?: number;
    page?: number;
  }): Promise<ManyResponse<Show>> {
    const { pageSize, page, ...rest } = options;

    const total = await this.prisma.show.count(rest);
    const profiles = await this.prisma.show.findMany({
      ...rest,
      ...getOffset(pageSize, page),
    });

    return paginateResponse(profiles, {
      total,
      pageSize,
      page,
    });
  }

  async create(input: CreateInput): Promise<Show> {
    return this.prisma.show.create({
      data: input,
    });
  }

  async update(id: string, input: UpdateInput): Promise<Show> {
    return this.prisma.show.update({
      where: { id },
      data: input,
    });
  }

  async delete(id: string): Promise<Show> {
    return this.prisma.show.delete({
      where: { id },
    });
  }
}
