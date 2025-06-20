import { fromOrderByInput } from "@caster/responses/prisma";
import type { RolesService } from "@caster/roles";
import type { AppAbility } from "@caster/auth/authorization";
import { subject } from "@casl/ability";
import type { Show } from "@prisma/client";

import type { UserWithProfile } from "../users/model";
import type {
  ShowCondition,
  Show as ShowModel,
  ShowsOrderBy,
  ShowsPage,
  CreateInput,
  UpdateInput,
} from "./model";
import type { ShowsService } from "./service";
import { Admin } from "./roles";
import {
  ForbiddenError,
  MissingProfileError,
  ShowNotFoundError,
} from "./errors";

export class ShowsController {
  constructor(
    private readonly service: ShowsService,
    private readonly roles: RolesService
  ) {}

  async get(id: string): Promise<ShowModel | undefined> {
    const show = await this.service.get(id);

    if (show) {
      return show;
    }
  }

  async list(
    where?: ShowCondition,
    orderBy?: ShowsOrderBy[],
    pageSize?: number,
    page?: number
  ): Promise<ShowsPage> {
    return this.service.list({
      where,
      orderBy: fromOrderByInput(orderBy),
      pageSize,
      page,
    });
  }

  async create(
    input: CreateInput,
    user: UserWithProfile,
    ability: AppAbility
  ): Promise<{ show?: ShowModel }> {
    if (!user.profile?.id) {
      throw new MissingProfileError("User object did not come with a Profile");
    }

    if (ability.cannot("create", subject("Show", fromCreateInput(input)))) {
      throw new ForbiddenError("User is not allowed to create a Show");
    }

    const show = await this.service.create(input);

    // Grant the Admin role to the creator
    await this.roles.grantRoles(
      user.profile?.id,
      { table: "Show", id: show.id },
      [Admin.key]
    );

    return { show };
  }

  async update(
    id: string,
    input: UpdateInput,
    ability: AppAbility
  ): Promise<{ show?: ShowModel }> {
    const existing = await this.getExisting(id);

    if (ability.cannot("update", subject("Show", fromShowModel(existing)))) {
      throw new ForbiddenError("User is not allowed to update this Show");
    }

    const show = await this.service.update(id, input);

    return { show };
  }

  async deleteShow(id: string, ability: AppAbility): Promise<boolean> {
    const existing = await this.getExisting(id);

    if (ability.cannot("delete", subject("Show", fromShowModel(existing)))) {
      throw new ForbiddenError("User is not allowed to delete this Show");
    }

    await this.service.delete(id);

    return true;
  }

  private getExisting = async (id: string) => {
    const existing = await this.service.get(id);
    if (!existing) {
      throw new ShowNotFoundError(id);
    }

    return existing;
  };
}

function fromCreateInput(input: CreateInput): Show {
  return {
    ...input,
    id: null,
    createdAt: null,
    updatedAt: null,
    summary: input.summary || null,
    picture: input.picture || null,
    content: input.content || null,
  };
}

function fromShowModel(show: ShowModel): Show {
  return {
    ...show,
    summary: show.summary || null,
    picture: show.picture || null,
    content: show.content || null,
  };
}
