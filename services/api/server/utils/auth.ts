import { createRemoteJWKSet } from "jose";
import type {
  User,
  Profile,
  RoleGrant,
  Show,
  Episode,
  Message,
} from "@prisma/client";
import { type PureAbility, AbilityBuilder } from "@casl/ability";
import {
  type PrismaQuery,
  type Subjects,
  createPrismaAbility,
} from "@casl/prisma";
import type { PermittedFieldsOptions } from "@casl/ability/extra";
import type { Action } from "@caster/roles";

export type AppSubjects = Subjects<{
  User: User;
  Profile: Profile;
  RoleGrant: RoleGrant;
  Show: Show;
  Episode: Episode;
  Message: Message;
}>;

export type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;

export const abilityBuilder = new AbilityBuilder<AppAbility>(
  createPrismaAbility
);

/**
 * Limits the returned object to the permittedFieldsOf the subject based on the ability
 */
export type CensorFields = <T extends AppSubjects>(
  subject: T,
  fieldOptions: PermittedFieldsOptions<AppAbility>,
  action?: Action
) => T;

/**
 * JWT Configuration
 */
export const jwks = createRemoteJWKSet(
  new URL(`${config.get("auth.url")}/.well-known/jwks.json`)
);
