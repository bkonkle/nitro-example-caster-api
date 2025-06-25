import type { Prisma } from "@prisma/client";

import type { User } from "../model";

export class Profile {
  id: string;
  email?: string | null; // Nullable because this field may be censored for unauthorized users
  displayName?: string | null;
  picture?: string | null;
  content?: Prisma.JsonValue;
  city?: string | null;
  stateProvince?: string | null;
  userId?: string | null;
  user?: User | null;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateInput {
  email: string;
  displayName?: string;
  picture?: string;
  content?: Prisma.JsonValue;
  userId: string;
}

export class UpdateInput {
  email?: string;
  displayName?: string;
  picture?: string;
  content?: Prisma.JsonValue;
  userId?: string;
}

export class ProfilesPage {
  data!: Profile[];
  count!: number;
  total!: number;
  page!: number;
  pageCount!: number;
}

export class ProfileCondition {
  id?: string;
  email?: string;
  displayName?: string;
  picture?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const ProfilesOrdering = {
  IdAsc: "ID_ASC",
  IdDesc: "ID_DESC",
  EmailAsc: "EMAIL_ASC",
  EmailDesc: "EMAIL_DESC",
  DisplayNameAsc: "DISPLAY_NAME_ASC",
  DisplayNameDesc: "DISPLAY_NAME_DESC",
  CreatedAtAsc: "CREATED_AT_ASC",
  CreatedAtDesc: "CREATED_AT_DESC",
  UpdatedAtAsc: "UPDATED_AT_ASC",
  UpdatedAtDesc: "UPDATED_AT_DESC",
} as const;

export type ProfilesOrderBy =
  (typeof ProfilesOrdering)[keyof typeof ProfilesOrdering];
