import { Prisma, type Profile, type User } from "@prisma/client";
import type { PermittedFieldsOptions } from "@casl/ability/extra";

import type { CreateInput } from "./model";

export type ProfileWithUser = Profile & { user: User | null };

export const isOwner = (profile: ProfileWithUser, username?: string) =>
  username && profile.user && username === profile.user.username;

export const censoredFields = ["email", "userId", "user"] as const;
export type CensoredProfile = Omit<Profile, (typeof censoredFields)[number]>;

export const fieldOptions: PermittedFieldsOptions<AppAbility> = {
  // Provide the list of all fields that should be revealed if the rule doesn't specify fields
  fieldsFrom: (rule) =>
    // Add the 'user' field in manually because it's on the model rather than the DB entity
    rule.fields || [...Object.values(Prisma.ProfileScalarFieldEnum), "user"],
};

export function fromCreateInput(input: CreateInput): Profile {
  return {
    ...input,
    id: null,
    createdAt: null,
    updatedAt: null,
    city: null,
    stateProvince: null,
    displayName: input.displayName ?? null,
    picture: input.picture ?? null,
    content: input.content ?? null,
  };
}
