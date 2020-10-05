import { browser } from "webextension-polyfill-ts";
import { Module, VuexModule, MutationAction, Mutation } from "vuex-module-decorators";
import Vue from "vue";

@Module({
  namespaced: true
})
export default class RootModule extends VuexModule {
  _lastPage: string = "login";
  

  @MutationAction({ mutate: [ "_lastPage" ] })
  async load() {
    const storage = await browser.storage.local.get();
    return { _lastPage: storage.lastPage || "login" };
  }

  @MutationAction({ mutate: [ "_lastPage" ] })
  async changePage(lastPage: string, app: Vue) {
    await browser.storage.local.set({ lastPage });
    return { _lastPage: lastPage }
  }

  get lastPage() {
    return this._lastPage;
  }
}