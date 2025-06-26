import { z } from "zod/v4";

import { ForbiddenError } from "../../../domains/errors";

const Input = z.object({
  email: z.email(),
  displayName: z.string().optional(),
  picture: z.string().optional(),
  content: z.json().optional(),
  userId: z.string(),
});

export default defineEventHandler(async (event) => {
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

  try {
    const result = await profiles.create(input, event.context.ability);

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
