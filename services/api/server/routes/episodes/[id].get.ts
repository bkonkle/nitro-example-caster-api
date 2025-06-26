export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const { episodes } = domains;

  const episode = await episodes.get(id);
  if (!episode) {
    throw createError({
      statusCode: 404,
      statusMessage: "Episode not found",
      message: `Episode with ID ${id} not found`,
    });
  }

  return episode;
});
