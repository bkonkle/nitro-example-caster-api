import type {
  EpisodeCondition,
  EpisodesOrderBy,
} from "../../../domains/shows/episodes/model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const where = getWhereInput<EpisodeCondition>(query);
  const orderBy = getOrderByInput<EpisodesOrderBy>(query);
  const { page, pageSize } = getPageInput(query);

  // Transform date inputs
  where.createdAt = parseDateInput("createdAt", where.createdAt);
  where.updatedAt = parseDateInput("updatedAt", where.updatedAt);

  const { shows } = domains;

  const result = await shows.list(where, orderBy, pageSize, page);

  return result;
});
