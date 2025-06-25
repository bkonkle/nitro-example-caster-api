import { RolesService } from "@caster/roles";

import { ShowsController } from "../../domains/shows/controller";
import { ShowsService } from "../../domains/shows/service";
import { ShowRoles } from "../../domains/shows/roles";
import { EpisodeRoles } from "../../domains/shows/episodes/roles";

declare global {
  var domains: Domains | undefined | null;
}

export type Domains = {
  shows: ShowsController;
  roles: RolesService;
};

export function useDomains(): Domains {
  if (!global.domains) {
    const prisma = usePrisma();

    const service = new ShowsService(prisma);

    const roles = new RolesService(
      prisma,
      [...ShowRoles.permissions, ...EpisodeRoles.permissions],
      [...ShowRoles.roles, ...EpisodeRoles.roles]
    );

    const shows = new ShowsController(service, roles);

    global.domains = { shows, roles };
  }

  return global.domains;
}
