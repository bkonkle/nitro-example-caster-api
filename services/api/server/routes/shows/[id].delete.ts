import { ForbiddenError, NotFoundError } from "../../../domains/errors";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const { shows } = useDomains();

  try {
    const result = await shows.delete(id, event.context.ability);

    return { sucess: result };
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      throw createError({
        statusCode: 404,
        statusMessage: error.name,
        message: error.message,
      });
    }

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
