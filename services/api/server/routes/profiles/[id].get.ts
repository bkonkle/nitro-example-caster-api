export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const { profiles } = domains;

  const profile = await profiles.get(id, event.context.censor);
  if (!profile) {
    throw createError({
      statusCode: 404,
      statusMessage: "Profile not found",
      message: `Profile with ID ${id} not found`,
    });
  }

  return profile;
});
