import Settings, { defaults } from '@/models/Settings';
import { browser } from "webextension-polyfill-ts";
import { Module, VuexModule, MutationAction, Action } from "vuex-module-decorators";

@Module({
  namespaced: true
})
export default class SettingsModule extends VuexModule {
  _settings: Settings = defaults;

  @MutationAction({ mutate: [ "_settings" ] })
  async load() {
    const storage = await browser.storage.local.get();
    return { _settings: storage.settings || defaults };
  }

  @Action
  async save() {
    browser.storage.local.set({ settings: this._settings });
  }

  get settings() {
    return this._settings;
  }
}