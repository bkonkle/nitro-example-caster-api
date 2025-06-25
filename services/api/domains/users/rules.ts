import type { AbilityBuilder } from "@casl/ability";

import type { UserWithProfile } from "./model";

export class UserRules implements RuleEnhancer {
  async forUser(
    user: UserWithProfile | undefined,
    { can }: AbilityBuilder<AppAbility>
  ) {
    if (user) {
      // Same username
      can(Action.Create, "User", { username: user.username });
      can(Action.Read, "User", { username: user.username });
      can(Action.Update, "User", { username: user.username });
    }
  }
}
