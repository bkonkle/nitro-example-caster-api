import type { AbilityBuilder } from "@casl/ability";
import type { RolesService } from "@caster/roles";

import type { UserWithProfile } from "../users/model";
import { Delete, ManageEpisodes, ManageRoles, Update } from "./roles";

export async function withShowRules(
  { can }: AbilityBuilder<AppAbility>,
  roles: RolesService,
  user?: UserWithProfile
) {
  // Anonymous
  can(Action.Read, "Show");

  if (!user) {
    return;
  }

  // Authenticated
  can(Action.Create, "Show");

  const profileId = user.profile?.id;
  if (!profileId) {
    return;
  }

  // Pull all the Permissions for this Profile in the Show table
  const showPermissions = await roles.getPermissionsForTable(profileId, "Show");

  // Iterate over the showIds returned and build rules for each Show
  Object.keys(showPermissions).forEach((showId) => {
    showPermissions[showId].forEach((permission) => {
      switch (permission.key) {
        case Update.key:
          return can(Action.Update, "Show", { id: showId });
        case Delete.key:
          return can(Action.Delete, "Show", { id: showId });
        case ManageEpisodes.key:
          return can(Action.Manage, "Episode", { showId });
        case ManageRoles.key:
          return can(Action.Manage, "RoleGrant", {
            subjectTable: "Show",
            subjectId: showId,
          });
      }
    });
  });
}
