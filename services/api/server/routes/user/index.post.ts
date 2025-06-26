import { z } from "zod/v4";

import { ForbiddenError } from "../../../domains/errors";

const Input = z.object({
  username: z.string().optional(),
  isActive: z.boolean().optional(),
});

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "You must be logged in to update your User.",
    });
  }

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

  const { users } = domains;

  try {
    const result = await users.updateUser(event.context.user.id, input);

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
