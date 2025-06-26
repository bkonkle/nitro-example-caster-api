import { z } from "zod/v4";

import { ForbiddenError } from "../../../domains/errors";

const Input = z.object({
  title: z.string().optional(),
  summary: z.string().optional(),
  picture: z.string().optional(),
  content: z.json().optional(),
  showId: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  const inputResult = await Input.safeParseAsync(body);
  if (!inputResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid input",
      message: inputResult.error.message,
    });
  }

  const input = inputResult.data;

  const { episodes } = domains;

  const episode = await episodes.get(id);
  if (!episode) {
    throw createError({
      statusCode: 404,
      statusMessage: "Episode not found",
      message: `Episode with ID ${id} not found`,
    });
  }

  try {
    const result = await episodes.update(id, input, event.context.ability);

    return result;
  } catch (error: unknown) {
    if (error instanceof ForbiddenError) {
      throw createError({
        statusCode: 403,
        statusMessage: error.name,
        message: error.message,
      });
    }

    const err = error as Error;

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: err.message,
    });
  }
});
