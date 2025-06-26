import { fromOrderByInput } from "@caster/responses/prisma";
import { subject } from "@casl/ability";

import type {
  CreateInput,
  ProfileCondition,
  Profile as ProfileModel,
  ProfilesOrderBy,
  ProfilesPage,
  UpdateInput,
} from "./model";
import type { ProfilesService } from "./service";
import { fieldOptions, fromCreateInput } from "./utils";
import { ForbiddenError, NotFoundError } from "../../errors";

export class ProfilesController {
  constructor(private readonly service: ProfilesService) {}

  async get(
    id: string,
    censor: CensorFields
  ): Promise<ProfileModel | undefined> {
    const profile = await this.service.get(id);

    if (profile) {
      const result = censor(subject("Profile", profile), fieldOptions);

      return result;
    }
  }

  async list(
    censor: CensorFields,
    where?: ProfileCondition,
    orderBy?: ProfilesOrderBy[],
    pageSize?: number,
    page?: number
  ): Promise<ProfilesPage> {
    const { data, ...rest } = await this.service.getMany({
      where,
      orderBy: fromOrderByInput(orderBy),
      pageSize,
      page,
    });

    const permitted = data.map((profile) =>
      censor(subject("Profile", profile), fieldOptions)
    );

    return { ...rest, data: permitted };
  }

  async create(
    input: CreateInput,
    ability: AppAbility
  ): Promise<{ profile?: ProfileModel }> {
    if (ability.cannot("create", subject("Profile", fromCreateInput(input)))) {
      throw new ForbiddenError("User is not allowed to create a Profile");
    }

    const profile = await this.service.create(input);

    return { profile };
  }

  async update(
    id: string,
    input: UpdateInput,
    ability: AppAbility
  ): Promise<{ profile?: ProfileModel }> {
    const existing = await this.getExisting(id);

    if (ability.cannot("update", subject("Profile", existing))) {
      throw new ForbiddenError("User is not allowed to update this Profile");
    }

    const profile = await this.service.update(id, input);

    return { profile };
  }

  async delete(id: string, ability: AppAbility): Promise<boolean> {
    const existing = await this.getExisting(id);

    if (ability.cannot("delete", subject("Profile", existing))) {
      throw new ForbiddenError("User is not allowed to delete this Profile");
    }

    await this.service.delete(id);

    return true;
  }

  private getExisting = async (id: string) => {
    const existing = await this.service.get(id);
    if (!existing) {
      throw new NotFoundError("Profile", id);
    }

    return existing;
  };
}
