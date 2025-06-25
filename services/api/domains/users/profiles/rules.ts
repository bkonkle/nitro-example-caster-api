import type { AbilityBuilder } from "@casl/ability";

import type { UserWithProfile } from "../model";

export class ProfileRules implements RuleEnhancer {
  async forUser(
    user: UserWithProfile | undefined,
    { can, cannot }: AbilityBuilder<AppAbility>
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
