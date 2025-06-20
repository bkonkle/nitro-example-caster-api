import type {
  Prisma,
  Profile as PrismaProfile,
  User as PrismaUser,
} from "@prisma/client";

import type { Profile } from "./profiles/model";

export class User {
  id!: string;
  username!: string;
  isActive!: boolean;
  profileId?: string | null;
  profile?: Profile | null;
  createdAt!: Date;
  updatedAt!: Date;
}

export type UserWithProfile = PrismaUser & { profile: PrismaProfile | null };

export class CreateProfileInput {
  email!: string;
  displayName?: string;
  picture?: string;
  content?: Prisma.JsonValue;
}

export class CreateInput {
  profile?: CreateProfileInput;
}

export class UpdateInput {
  username?: string;
  isActive?: boolean;
}
