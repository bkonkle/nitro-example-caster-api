import type {
  ProfileCondition,
  ProfilesOrderBy,
} from "../../../domains/users/profiles/model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const where = getWhereInput<ProfileCondition>(query);
  const orderBy = getOrderByInput<ProfilesOrderBy>(query);
  const { page, pageSize } = getPageInput(query);

  // Transform date inputs
  where.createdAt = parseDateInput("createdAt", where.createdAt);
  where.updatedAt = parseDateInput("updatedAt", where.updatedAt);

  const { profiles } = domains;

  const result = await profiles.list(
    event.context.censor,
    where,
    orderBy,
    pageSize,
    page
  );

  return result;
});
