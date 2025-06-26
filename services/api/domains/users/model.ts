import type {
  Prisma,
  Profile as PrismaProfile,
  User as PrismaUser,
} from "@prisma/client";

import type { Profile } from "./profiles/model";

export type User = {
  id: string;
  username: string;
  isActive: boolean;
  profileId?: string | null;
  profile?: Profile | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithProfile = PrismaUser & { profile: PrismaProfile | null };

export type CreateProfileInput = {
  email: string;
  displayName?: string;
  picture?: string;
  content?: Prisma.JsonValue;
};

export type CreateInput = {
  profile?: CreateProfileInput;
};

export type UpdateInput = {
  username?: string;
  isActive?: boolean;
};
