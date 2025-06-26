import type { AbilityBuilder } from "@casl/ability";

import type { UserWithProfile } from "./model";

export async function withUserRules(
  { can }: AbilityBuilder<AppAbility>,
  user?: UserWithProfile
) {
  if (user) {
    // Same username
    can(Action.Create, "User", { username: user.username });
    can(Action.Read, "User", { username: user.username });
    can(Action.Update, "User", { username: user.username });
  }
}
