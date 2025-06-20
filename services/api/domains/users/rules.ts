import {
  type RuleBuilder,
  type RuleEnhancer,
  Action,
} from "@caster/auth/authorization";

import type { UserWithProfile } from "./model";

export class UserRules implements RuleEnhancer {
  async forUser(user: UserWithProfile | undefined, { can }: RuleBuilder) {
    if (user) {
      // Same username
      can(Action.Create, "User", { username: user.username });
      can(Action.Read, "User", { username: user.username });
      can(Action.Update, "User", { username: user.username });
    }
  }
}
