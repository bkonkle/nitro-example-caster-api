import type { ShowCondition, ShowsOrderBy } from "../../../domains/shows/model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const where = getWhereInput<ShowCondition>({}, query.where);

  const orderBy: ShowsOrderBy[] = Array.isArray(query.orderBy)
    ? query.orderBy
    : [query.orderBy];

  const pageSize = query.pageSize
    ? Number.parseInt(query.pageSize as string, 10)
    : 10;

  const page = query.page ? Number.parseInt(query.page as string, 10) : 1;

  const { shows } = useDomains();

  const result = await shows.list(where, orderBy, pageSize, page);

  console.log(">- result ->", result);
});
