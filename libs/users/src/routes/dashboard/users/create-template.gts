
import { UserChangeset } from "#src/changesets/user.ts";
import UsersForm from "#src/components/forms/user-form.gts";
import Component from "@glimmer/component";
import type { UsersCreateRouteSignature } from "./create.gts";
import type Owner from "@ember/owner";

export default class UsersCreateRouteTemplate extends Component<UsersCreateRouteSignature> {
  changeset = new UserChangeset({});

  public constructor(owner: Owner, args: UsersCreateRouteSignature) {
    super(owner, args);
    console.log("Creating UsersCreateRouteTemplate", this.changeset);
  }

  <template>
    <UsersForm @changeset={{this.changeset}} />
  </template>
}
