import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

declare global {
  var auth: ReturnType<typeof betterAuth> | undefined | null;
}

export interface JWT {
  jti: string; // JWT id
  iss?: string; // issuer
  aud?: string | string[]; // audience
  sub?: string; // subject
  iat?: number; // issued at
  exp?: number; // expires in
  nbf?: number; // not before
}

export interface JwtRequest extends Request {
  jwt?: JWT;
}

export interface JwtContext {
  req: JwtRequest;
}

export function useAuth() {
  const prisma = usePrisma();

  if (!global.auth) {
    global.auth = betterAuth({
      database: prismaAdapter(prisma, { provider: "postgresql" }),
      emailAndPassword: { enabled: true },
    });
  }

  return global.auth;
}
