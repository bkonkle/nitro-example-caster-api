import type {
  User,
  Profile,
  RoleGrant,
  Show,
  Episode,
  Message,
} from "@prisma/client";
import { type PureAbility, AbilityBuilder } from "@casl/ability";
import type { PermittedFieldsOptions } from "@casl/ability/extra";
import {
  type PrismaQuery,
  type Subjects,
  createPrismaAbility,
} from "@casl/prisma";

import type { JwtContext, JwtRequest } from "./authentication";

/**
 * Abilities for the App, based on Prisma Entities
 */

export const Action = {
  Create: "create",
  Read: "read",
  Update: "update",
  Delete: "delete",
  Manage: "manage",
} as const;
export type Action = (typeof Action)[keyof typeof Action];

export type AppSubjects = Subjects<{
  User: User;
  Profile: Profile;
  RoleGrant: RoleGrant;
  Show: Show;
  Episode: Episode;
  Message: Message;
}>;

export type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;
export const AppAbility = new AbilityBuilder<AppAbility>(createPrismaAbility);

/**
 * Rule Enhancers (used to add Casl ability rules to the AppAbility)
 */

export type RuleBuilder = Pick<AbilityBuilder<AppAbility>, "can" | "cannot">;

export interface RuleEnhancer {
  forUser(
    user: (User & { profile: Profile | null }) | undefined,
    builder: RuleBuilder
  ): Promise<void>;
}

/**
 * Custom JWT Request and Context objects with the metadata added to the Request.
 */

export interface AuthRequest<User> extends JwtRequest {
  user?: User;
  ability?: AppAbility;
  censor?: <T extends AppSubjects>(
    subject: T,
    fieldOptions: PermittedFieldsOptions<AppAbility>,
    action?: Action
  ) => T;
}

export interface AuthContext<User> extends JwtContext {
  req: AuthRequest<User>;
}

/**
 * Limits the returned object to the permittedFieldsOf the subject based on the ability
 */
export type CensorFields<User> = NonNullable<AuthRequest<User>["censor"]>;

/**
 * Set metadata indicating that this route should be public.
 */
export const ALLOW_ANONYMOUS = "auth:allow-anonymous";
export type AllowAnonymousMetadata = boolean;
