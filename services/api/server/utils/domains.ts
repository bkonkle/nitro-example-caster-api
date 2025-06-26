import { RolesService } from "@caster/roles";

import { ShowsController } from "../../domains/shows/controller";
import { ShowsService } from "../../domains/shows/service";
import { ShowRoles } from "../../domains/shows/roles";
import { EpisodeRoles } from "../../domains/shows/episodes/roles";
import { UsersController } from "../../domains/users/controller";
import { UsersService } from "../../domains/users/service";

declare global {
  var domains: Domains | undefined | null;
}

export type Domains = {
  users: UsersController;
  roles: RolesService;
  shows: ShowsController;
};

export function useDomains(): Domains {
  if (!global.domains) {
    const usersService = new UsersService(prisma);
    const showsService = new ShowsService(prisma);

    const roles = new RolesService(
      prisma,
      [...ShowRoles.permissions, ...EpisodeRoles.permissions],
      [...ShowRoles.roles, ...EpisodeRoles.roles]
    );

    const users = new UsersController(usersService);
    const shows = new ShowsController(showsService, roles);

    global.domains = { users, roles, shows };
  }

  return global.domains;
}
