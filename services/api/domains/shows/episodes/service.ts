import {
  getOffset,
  paginateResponse,
  type ManyResponse,
} from "@caster/responses/pagination";
import type { Prisma, PrismaClient, Episode } from "@prisma/client";

import type { CreateInput, UpdateInput } from "./model";

export class EpisodesService {
  constructor(private readonly prisma: PrismaClient) {}

  async get(id: string): Promise<Episode | null> {
    return this.prisma.episode.findFirst({
      where: { id },
    });
  }

  async getMany(options: {
    where: Prisma.EpisodeWhereInput | undefined;
    orderBy: Prisma.EpisodeOrderByWithRelationInput | undefined;
    pageSize?: number;
    page?: number;
  }): Promise<ManyResponse<Episode>> {
    const { pageSize, page, ...rest } = options;

    const total = await this.prisma.episode.count(rest);
    const profiles = await this.prisma.episode.findMany({
      ...rest,
      ...getOffset(pageSize, page),
    });

    return paginateResponse(profiles, {
      total,
      pageSize,
      page,
    });
  }

  async create(input: CreateInput): Promise<Episode> {
    return this.prisma.episode.create({
      data: input,
    });
  }

  async update(id: string, input: UpdateInput): Promise<Episode> {
    return this.prisma.episode.update({
      where: { id },
      data: input,
    });
  }

  async delete(id: string): Promise<Episode> {
    return this.prisma.episode.delete({
      where: { id },
    });
  }
}
