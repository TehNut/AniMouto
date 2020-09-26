import { browser } from "webextension-polyfill-ts";
import decode from "jwt-decode";
import { Module, VuexModule, MutationAction } from "vuex-module-decorators";
import { AniListUser } from '@/models/User';

@Module({
  namespaced: true
})
export default class UserModule extends VuexModule {
  _token: string | null = null;
  _user: AniListUser = new AniListUser();

  @MutationAction({ mutate: [ "_token" ] })
  async loadToken() {
    const storage = await browser.storage.local.get();
    return { _token: storage.token || null };
  }

  @MutationAction({ mutate: [ "_user" ] })
  async loadUser() {
    // TODO submit query with apollo
    return { _user: new AniListUser() }
  }

  get user(): AniListUser {
    return this._user;
  }

  get loggedIn(): boolean {
    if (!this._token)
      return false;

    console.log("test")
    const { exp } = decode(this._token);
    return exp - Math.floor(Date.now() / 1000) <= 0;
  }
}