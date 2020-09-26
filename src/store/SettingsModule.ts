import Settings, { defaults } from '@/models/Settings';
import { browser } from "webextension-polyfill-ts";
import { Module, VuexModule, MutationAction } from "vuex-module-decorators";

@Module({
  namespaced: true
})
export default class SettingsModule extends VuexModule {
  settings: Settings = defaults;

  @MutationAction({ mutate: [ "settings" ] })
  async load() {
    const storage = await browser.storage.local.get();
    return { settings: storage.settings || defaults };
  }
}