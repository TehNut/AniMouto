import { browser } from "webextension-polyfill-ts";
import { Module, VuexModule, MutationAction, Mutation } from "vuex-module-decorators";

@Module({
  namespaced: true
})
export default class RootModule extends VuexModule {
  _lastPage: string = "login";
  _theme: string = "light"

  @MutationAction({ mutate: [ "_lastPage", "_theme" ] })
  async load() {
    const storage = await browser.storage.local.get();
    return { 
      _lastPage: storage.lastPage || "login", 
      _theme: storage.theme || "light" 
    };
  }

  @MutationAction({ mutate: [ "_lastPage" ] })
  async changePage(lastPage: string) {
    await browser.storage.local.set({ lastPage });
    return { _lastPage: lastPage }
  }

  get lastPage() {
    return this._lastPage;
  }

  get theme() {
    return this._theme;
  }
}