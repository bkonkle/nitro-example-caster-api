import type { Show } from "@prisma/client";

import type { CreateInput, Show as ShowModel } from "./model";

export function fromCreateInput(input: CreateInput): Show {
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

export function fromShowModel(show: ShowModel): Show {
  return {
    ...show,
    summary: show.summary || null,
    picture: show.picture || null,
    content: show.content || null,
  };
}
