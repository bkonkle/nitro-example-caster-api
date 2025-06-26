import type { QueryObject } from "ufo";

export function parseDateInput(
  propertyName: string,
  date?: Date
): Date | undefined {
  if (!date) {
    return date;
  }

  const parsedDate = new Date(date as unknown as string);

  if (Number.isNaN(parsedDate.getTime())) {
    throw createError({
      statusCode: 400,
      message: `Invalid date format for ${propertyName}: ${date}`,
    });
  }

  return parsedDate;
}

export function getWhereInput<T>(query: QueryObject): T {
  const where = {} as T;

  if (!query.where) {
    return where;
  }

  const entries: string[] = Array.isArray(query.where)
    ? query.where
    : [query.where];

  for (const entry of entries) {
    const items = entry.split(",");

    for (const item of items) {
      const parts = item.split("=");

      if (parts.length === 2) {
        const key = parts[0].trim();
        const value = parts[1].trim();

        if (key && value) {
          where[key] = value;
        }
      } else {
        throw createError({
          statusCode: 400,
          message: `Invalid where condition: ${item}. Expected format is key=value.`,
        });
      }
    }
  }

  return where;
}

export function getOrderByInput<T>(query: QueryObject): T[] {
  if (!query.orderBy) {
    return [];
  }

  const orderBy = Array.isArray(query.orderBy)
    ? query.orderBy
    : [query.orderBy];

  return orderBy;
}

export function getPageInput(query: QueryObject): {
  pageSize: number;
  page: number;
} {
  const pageStr: string | undefined = Array.isArray(query.page)
    ? query.page[0]
    : query.page;

  const page = pageStr ? Number.parseInt(pageStr, 10) : 1;

  const pageSizeStr: string | undefined = Array.isArray(query.pageSize)
    ? query.pageSize[0]
    : query.pageSize;

  const pageSize = pageSizeStr ? Number.parseInt(pageSizeStr, 10) : 10;

  return { page, pageSize };
}
