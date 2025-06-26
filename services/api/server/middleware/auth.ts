import { jwtVerify } from "jose";

import type { UserWithProfile } from "../../domains/users/model";
import { withUserRules } from "../../domains/users/rules";
import { withProfileRules } from "../../domains/users/profiles/rules";
import { withShowRules } from "../../domains/shows/rules";
import { withEpisodeRules } from "../../domains/shows/episodes/rules";

export default defineEventHandler(async (event) => {
  const domains = useDomains();

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
    user = await getUser();

    await session.update({ user });
  }

  await withUserRules(appAbility, user);
  await withProfileRules(appAbility, user);
  await withShowRules(appAbility, domains.roles, user);
  await withEpisodeRules(appAbility, domains.roles, user);

  event.context.user = user;
  event.context.ability = appAbility;
});

function resolveAuthorizationHeader(headers?: Headers): string | undefined {
  if (!headers || !headers.has("authorization")) {
    return;
  }

  const parts = headers.get("authorization")?.trim().split(" ") ?? [];

  if (parts.length !== 2) {
    return;
  }

  const scheme = parts[0];
  const credentials = parts[1];

  if (/^Bearer$/i.test(scheme)) {
    return credentials;
  }
}

async function getUser(
  headers?: Headers
): Promise<UserWithProfile | undefined> {
  const token = resolveAuthorizationHeader(headers);

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
      const result = await domains.users.getOrCreateCurrentUser(
        {
          profile: {
            email: json.email,
            displayName: json.nickname,
            picture: json.picture,
          },
        },
        username
      );

      return result?.user as UserWithProfile | undefined;
    }
  } catch (error: unknown) {
    console.error("Error fetching userinfo:", error);
  }
}
