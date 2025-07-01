import type { AbilityBuilder } from "@casl/ability";
import { Actions } from "@caster/roles";

import type { UserWithProfile } from "../model";

export async function withProfileRules(
  { can, cannot }: AbilityBuilder<AppAbility>,
  user?: UserWithProfile
) {
  // Anonymous
  can(Actions.Read, "Profile");
  cannot(Actions.Read, "Profile", ["email", "userId", "user"]);

  if (user) {
    // Same user
    can(Actions.Manage, "Profile", { userId: user.id });
    cannot(Actions.Update, "Profile", ["userId", "user"]);
  }
}
