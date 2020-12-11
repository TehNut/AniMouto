import { Settings, defaults } from '@/models/Settings';
import { browser } from "webextension-polyfill-ts";
import { Module, VuexModule, MutationAction, Action, Mutation } from "vuex-module-decorators";

@Module({
  namespaced: true
})
export default class SettingsModule extends VuexModule {
  
  _theme: string = "light";
  _accent: string = "blue";
  _wide: boolean = false;

  @MutationAction({ mutate: [ "_theme", "_accent", "_wide" ] })
  async load() {
    const storage = await browser.storage.local.get();
    const settings = storage.settings as Settings;
    return { 
      _theme: settings?.theme || defaults.theme,
      _accent: settings?.accent || defaults.accent,
      _wide: settings?.wide || defaults.wide,
    };
  }

  @Action
  async save() {
    browser.storage.local.set({ settings: {
      theme: this._theme,
      accent: this._accent,
      wide: this._wide,
    }});
  }

  @Mutation
  changeTheme(theme: string) {
    this._theme = theme;
  }

  @Mutation
  changeAccent(accent: string) {
    this._accent = accent;
  }

  @Mutation
  setWide(wide: boolean) {
    this._wide = wide;
  }

  get theme(): string {
    return this._theme;
  }

  get accent(): string {
    return this._accent;
  }

  get wide(): boolean {
    return this._wide;
  }
}