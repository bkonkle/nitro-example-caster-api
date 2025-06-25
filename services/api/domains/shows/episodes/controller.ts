import { fromOrderByInput } from "@caster/responses/prisma";
import type { AppAbility } from "@caster/auth/authorization";

import type { UserWithProfile } from "../../users/model";
import type {
  CreateInput,
  EpisodeCondition,
  Episode as EpisodeModel,
  EpisodesOrderBy,
  EpisodesPage,
  UpdateInput,
} from "./model";
import type { EpisodesService } from "./service";
import { BadRequestError, ForbiddenError, NotFoundError } from "./errors";
import { subject } from "@casl/ability";
import { fromCreateInput } from "./utils";

export class EpisodesResolver {
  constructor(private readonly service: EpisodesService) {}

  async getEpisode(id: string): Promise<EpisodeModel | undefined> {
    const episode = await this.service.get(id);

    if (episode) {
      return episode;
    }
  }

  async getManyEpisodes(
    where?: EpisodeCondition,
    orderBy?: EpisodesOrderBy[],
    pageSize?: number,
    page?: number
  ): Promise<EpisodesPage> {
    return this.service.getMany({
      where,
      orderBy: fromOrderByInput(orderBy),
      pageSize,
      page,
    });
  }

  async createEpisode(
    input: CreateInput,
    user: UserWithProfile,
    ability: AppAbility
  ): Promise<{ episode?: EpisodeModel }> {
    if (!user.profile?.id) {
      throw new BadRequestError("User object did not come with a Profile");
    }

    if (ability.cannot("create", subject("Episode", fromCreateInput(input)))) {
      throw new ForbiddenError(
        "User does not have permission to create an Episode"
      );
    }

    const episode = await this.service.create(input);

    return { episode };
  }

  async updateEpisode(
    id: string,
    input: UpdateInput,
    ability: AppAbility
  ): Promise<{ episode?: EpisodeModel }> {
    const existing = await this.getExisting(id);

    if (ability.cannot("update", subject("Episode", existing))) {
      throw new ForbiddenError(
        "User does not have permission to update this Episode"
      );
    }

    const episode = await this.service.update(id, input);

    return { episode };
  }

  async deleteEpisode(id: string, ability: AppAbility): Promise<boolean> {
    const existing = await this.getExisting(id);

    if (ability.cannot("delete", subject("Episode", existing))) {
      throw new ForbiddenError(
        "User does not have permission to delete this Episode"
      );
    }

    await this.service.delete(id);

    return true;
  }

  private getExisting = async (id: string) => {
    const existing = await this.service.get(id);
    if (!existing) {
      throw new NotFoundError(id);
    }

    return existing;
  };
}
