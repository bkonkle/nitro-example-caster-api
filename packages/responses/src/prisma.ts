import { camelCase } from "lodash-es";

/**
 * Given a GraphQL order by input like "DISPLAY_NAME_ASC", return Prisma orderBy input
 */
export const fromOrderByInput = <K extends string>(
  orderBy?: K[]
): Record<string, unknown> | undefined => {
  return orderBy?.reduce((memo, order) => {
    const index = order.lastIndexOf("_");
    const [field, direction] = [
      camelCase(order.slice(0, index)),
      order.slice(index + 1).toLowerCase(),
    ];

    memo[field] = direction;

    return memo;
  }, {} as Record<string, unknown>);
};
