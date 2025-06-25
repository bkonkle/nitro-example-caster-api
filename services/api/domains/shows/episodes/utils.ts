import type { Episode } from "@prisma/client";

import type { CreateInput } from "./model";

export function fromCreateInput(input: CreateInput): Episode {
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
