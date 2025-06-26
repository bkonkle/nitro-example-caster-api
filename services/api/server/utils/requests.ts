import type { QueryValue } from "ufo";

export function getWhereInput<T>(
  initial: T,
  value: QueryValue | QueryValue[]
): T {
  const where = { ...initial };

  const entries = Array.isArray(value) ? value : [value];

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
