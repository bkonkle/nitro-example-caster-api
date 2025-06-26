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

import type { UserWithProfile } from "../../domains/users/model";
import { createRemoteJWKSet } from "jose";

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

export const appAbility = new AbilityBuilder<AppAbility>(createPrismaAbility);

/**
 * Custom JWT Request and Context objects with the metadata added to the Request.
 */

export interface JWT {
  jti: string; // JWT id
  iss?: string; // issuer
  aud?: string | string[]; // audience
  sub?: string; // subject
  iat?: number; // issued at
  exp?: number; // expires in
  nbf?: number; // not before
}

export interface JwtRequest extends Request {
  jwt?: JWT;
}

export interface JwtContext {
  req: JwtRequest;
}

export interface AuthRequest extends JwtRequest {
  user?: UserWithProfile;
  ability?: AppAbility;
  censor?: <T extends AppSubjects>(
    subject: T,
    fieldOptions: PermittedFieldsOptions<AppAbility>,
    action?: Action
  ) => T;
}

export interface AuthContext extends JwtContext {
  req: AuthRequest;
}

/**
 * Limits the returned object to the permittedFieldsOf the subject based on the ability
 */
export type CensorFields = NonNullable<AuthRequest["censor"]>;

/**
 * JWT Configuration
 */
export const jwks = createRemoteJWKSet(
  new URL(`${config.get("auth.url")}/.well-known/jwks.json`)
);
