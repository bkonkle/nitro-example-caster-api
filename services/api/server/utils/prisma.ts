import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: config.get("env") === "test" ? ["warn"] : ["info"],
});

export default prisma;
