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
