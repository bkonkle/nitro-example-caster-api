import { RolesService } from "@caster/roles";

import { UsersController } from "../../domains/users/controller";
import { UsersService } from "../../domains/users/service";
import { ProfilesController } from "../../domains/users/profiles/controller";
import { ProfilesService } from "../../domains/users/profiles/service";
import { ShowRoles } from "../../domains/shows/roles";
import { ShowsController } from "../../domains/shows/controller";
import { ShowsService } from "../../domains/shows/service";
import { EpisodeRoles } from "../../domains/shows/episodes/roles";
import { EpisodesController } from "../../domains/shows/episodes/controller";
import { EpisodesService } from "../../domains/shows/episodes/service";

export type Domains = {
  users: UsersController;
  profiles: ProfilesController;
  roles: RolesService;
  shows: ShowsController;
  episodes: EpisodesController;
};

export function getDomains(): Domains {
  const usersService = new UsersService(prisma);
  const profilesService = new ProfilesService(prisma);
  const showsService = new ShowsService(prisma);
  const episodesService = new EpisodesService(prisma);

  const roles = new RolesService(
    prisma,
    [...ShowRoles.permissions, ...EpisodeRoles.permissions],
    [...ShowRoles.roles, ...EpisodeRoles.roles]
  );

  const users = new UsersController(usersService);
  const profiles = new ProfilesController(profilesService);
  const shows = new ShowsController(showsService, roles);
  const episodes = new EpisodesController(episodesService);

  return { users, profiles, roles, shows, episodes };
}

export const domains = getDomains();
