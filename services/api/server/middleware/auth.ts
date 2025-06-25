import type { UserWithProfile } from "../../domains/users/model";
import { UserRules } from "../../domains/users/rules";
import { ProfileRules } from "../../domains/users/profiles/rules";
import { ShowRules } from "../../domains/shows/rules";
import { EpisodeRules } from "../../domains/shows/episodes/rules";

export default defineEventHandler(async (event) => {
  const auth = useAuth();

  const user: UserWithProfile | undefined = undefined;

  const { headers } = event;
  const session = await auth.api.getSession({ headers });
  if (session) {
    console.log(">- session ->", session);
  }

  const domains = useDomains();

  const userRules = new UserRules();
  userRules.forUser(user, appAbility);

  const profileRules = new ProfileRules();
  profileRules.forUser(user, appAbility);

  const showRules = new ShowRules(domains.roles);
  showRules.forUser(user, appAbility);

  const episodeRules = new EpisodeRules(domains.roles);
  episodeRules.forUser(user, appAbility);

  event.context.user = user;
  event.context.ability = appAbility;
});
