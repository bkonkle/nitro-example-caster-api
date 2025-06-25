import {
  Action,
  type RuleBuilder,
  type RuleEnhancer,
} from "@caster/auth/authorization";
import type { RolesService } from "@caster/roles";

import type { UserWithProfile } from "../../users/model";
import { Chat, ReadChat } from "./roles";

export class EpisodeRules implements RuleEnhancer {
  constructor(private readonly roles: RolesService) {}

  async forUser(
    user: UserWithProfile | undefined,
    { can }: RuleBuilder
  ): Promise<void> {
    // Anonymous
    can(Action.Read, "Episode");

    if (!user) {
      return;
    }

    // Authenticated
    const profileId = user.profile?.id;
    if (!profileId) {
      return;
    }

    // Pull all the Permissions for this Profile in the Episode table
    const episodePermissions = await this.roles.getPermissionsForTable(
      profileId,
      "Episode"
    );

    // Iterate over the episodeIds returned and build rules for each Episode
    Object.keys(episodePermissions).forEach((episodeId) => {
      episodePermissions[episodeId].forEach((permission) => {
        switch (permission.key) {
          case Chat.key:
            return can(Action.Manage, "Message", { episodeId, profileId });
          case ReadChat.key:
            return can(Action.Read, "Message", { episodeId });
        }
      });
    });
  }
}
