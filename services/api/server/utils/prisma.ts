import { PrismaClient } from "@prisma/client";

import { defaultConfig } from "./config";

declare global {
  var prisma: PrismaClient | undefined | null;
}

export function setPrismaClient(client: PrismaClient): void {
  global.prisma = client;
}

export function usePrisma(config = defaultConfig): PrismaClient {
  if (!global.prisma) {
    const client = new PrismaClient({
      log: config.get("env") === "test" ? ["warn"] : ["info"],
    });

    setPrismaClient(client);
  }

  return global.prisma;
}
