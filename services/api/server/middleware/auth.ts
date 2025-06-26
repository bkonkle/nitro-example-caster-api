import pick from "lodash/pick";
import { jwtVerify } from "jose";
import {
  permittedFieldsOf,
  type PermittedFieldsOptions,
} from "@casl/ability/extra";

import type { Action } from "../utils/auth";
import type { UserWithProfile } from "../../domains/users/model";
import type { UsersController } from "../../domains/users/controller";
import { withUserRules } from "../../domains/users/rules";
import { withProfileRules } from "../../domains/users/profiles/rules";
import { withShowRules } from "../../domains/shows/rules";
import { withEpisodeRules } from "../../domains/shows/episodes/rules";

export default defineEventHandler(async (event) => {
  const { roles, users } = domains;

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
    user = await getUser(users);

    await session.update({ user });
  }

  await withUserRules(abilityBuilder, user);
  await withProfileRules(abilityBuilder, user);
  await withShowRules(abilityBuilder, roles, user);
  await withEpisodeRules(abilityBuilder, roles, user);

  const ability = abilityBuilder.build();

  event.context.user = user;
  event.context.ability = ability;

  event.context.censor = <T extends AppSubjects>(
    subject: AppSubjects,
    fieldOptions: PermittedFieldsOptions<AppAbility>,
    action: Action = "read"
  ): T => {
    const fields = permittedFieldsOf(ability, action, subject, fieldOptions);

    return pick(subject, fields) as T;
  };
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
  users: UsersController,
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
