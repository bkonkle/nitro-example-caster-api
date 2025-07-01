import type { AbilityBuilder } from "@casl/ability";
import { Actions } from "@caster/roles";

import type { UserWithProfile } from "./model";

export async function withUserRules(
  { can }: AbilityBuilder<AppAbility>,
  user?: UserWithProfile
) {
  if (user) {
    // Same username
    can(Actions.Create, "User", { username: user.username });
    can(Actions.Read, "User", { username: user.username });
    can(Actions.Update, "User", { username: user.username });
  }
}
