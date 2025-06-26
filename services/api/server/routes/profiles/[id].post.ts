import { z } from "zod/v4";

import { ForbiddenError } from "../../../domains/errors";

const Input = z.object({
  email: z.email().optional(),
  displayName: z.string().optional(),
  picture: z.string().optional(),
  content: z.json().optional(),
  userId: z.string().optional(),
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

  const { profiles } = domains;

  const profile = await profiles.get(id, event.context.censor);
  if (!profile) {
    throw createError({
      statusCode: 404,
      statusMessage: "Profile not found",
      message: `Profile with ID ${id} not found`,
    });
  }

  try {
    const result = await profiles.update(id, input, event.context.ability);

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
