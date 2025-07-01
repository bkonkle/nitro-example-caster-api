import { jwtVerify } from "jose";

import type { UserWithProfile } from "../../domains/users/model";
import type { UsersController } from "../../domains/users/controller";

export default defineEventHandler(async (event) => {
  const { users } = domains;

  const session = await useSession(event, {
    password: config.get("auth.secret"),
    cookie: {
      httpOnly: true,
      secure: true,
    },
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  let user: UserWithProfile | undefined = session.data?.user;
  if (!user) {
    console.log(">- event.context.headers ->", event.context.headers);

    user = await getUser(users, getRequestHeader(event, "authorization"));

    await session.update({ user });
  }

  event.context.user = user;
});

async function getUser(
  users: UsersController,
  header?: string
): Promise<UserWithProfile | undefined> {
  const token = resolveAuthorizationHeader(header);
  if (!token) {
    return;
  }

  console.log(">- token ->", token);

  const jwt = await jwtVerify(token, jwks, {
    issuer: `${config.get("auth.url")}/`,
    audience: config.get("auth.audience"),
  });

  try {
    const result = await fetch(`${config.get("auth.url")}/userinfo`, {
      headers: { authorization: `Bearer ${token}` },
    });
    const json = await result.json();

    const username = jwt?.payload.sub;
    if (username) {
      const result = await users.getOrCreateUser(username, {
        profile: {
          email: json.email,
          displayName: json.nickname,
          picture: json.picture,
        },
      });

      return result?.user as UserWithProfile | undefined;
    }
  } catch (error: unknown) {
    console.error("Error fetching userinfo:", error);
  }
}

function resolveAuthorizationHeader(header?: string): string | undefined {
  const parts = header?.trim().split(" ") ?? [];

  if (parts.length !== 2) {
    return;
  }

  const scheme = parts[0];
  const credentials = parts[1];

  if (/^Bearer$/i.test(scheme)) {
    return credentials;
  }
}
