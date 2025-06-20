import {
  type RuleBuilder,
  type RuleEnhancer,
  Action,
} from "@caster/auth/authorization";

import type { UserWithProfile } from "../model";

export class ProfileRules implements RuleEnhancer {
  async forUser(
    user: UserWithProfile | undefined,
    { can, cannot }: RuleBuilder
  ) {
    // Anonymous
    can(Action.Read, "Profile");
    cannot(Action.Read, "Profile", ["email", "userId", "user"]);

    if (user) {
      // Same user
      can(Action.Manage, "Profile", { userId: user.id });
      cannot(Action.Update, "Profile", ["userId", "user"]);
    }
  }
}
