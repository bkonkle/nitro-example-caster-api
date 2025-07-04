import type { ShowCondition, ShowsOrderBy } from "../../../domains/shows/model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const where = getWhereInput<ShowCondition>(query);
  const orderBy = getOrderByInput<ShowsOrderBy>(query);
  const { page, pageSize } = getPageInput(query);

  // Transform date inputs
  where.createdAt = parseDateInput("createdAt", where.createdAt);
  where.updatedAt = parseDateInput("updatedAt", where.updatedAt);

  const { shows } = domains;

  const result = await shows.list(where, orderBy, pageSize, page);

  return result;
});
