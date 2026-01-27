import { getOwner, setOwner } from '@ember/owner';
import AuthHandler from '@libs/users/handlers/auth';
import { RequestManager } from '@warp-drive/core';
import { Fetch } from '@warp-drive/core';

export default {
  create(args: object) {
    const authHandler = new AuthHandler();
    setOwner(authHandler, getOwner(args)!);

    return new RequestManager()
      .use([authHandler, Fetch]);
  }
}
