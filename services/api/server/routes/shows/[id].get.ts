export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const { shows } = useDomains();

  const show = await shows.get(id);
  if (!show) {
    throw createError({
      statusCode: 404,
      statusMessage: "Show not found",
      message: `Show with ID ${id} not found`,
    });
  }

  return show;
});
