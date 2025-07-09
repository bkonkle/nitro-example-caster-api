import pick from "lodash-es/pick.js";
import {
  permittedFieldsOf,
  type PermittedFieldsOptions,
} from "@casl/ability/extra";
import type { Action } from "@caster/roles";

import { withUserRules } from "../../domains/users/rules";
import { withProfileRules } from "../../domains/users/profiles/rules";
import { withShowRules } from "../../domains/shows/rules";
import { withEpisodeRules } from "../../domains/shows/episodes/rules";

export default defineEventHandler(async (event) => {
  const { roles } = domains;

  await withUserRules(abilityBuilder, event.context.user);
  await withProfileRules(abilityBuilder, event.context.user);
  await withShowRules(abilityBuilder, roles, event.context.user);
  await withEpisodeRules(abilityBuilder, roles, event.context.user);

  const ability = abilityBuilder.build();

  event.context.ability = ability;

  event.context.censor = <T extends AppSubjects>(
    subject: AppSubjects,
    fieldOptions: PermittedFieldsOptions<AppAbility>,
    action: Action = "read"
  ): T => {
    const fields = permittedFieldsOf(ability, action, subject, fieldOptions);

    return pick(subject, fields) as T;
  };
});
