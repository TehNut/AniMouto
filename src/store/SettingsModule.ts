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
  _enablePolling: boolean = true;
  _pollingInterval: number = 1;
  _desktopNotifications: boolean = false;

  @MutationAction({ mutate: [ 
    "_theme", "_accent", "_wide", 
    "_enablePolling", "_pollingInterval", "_desktopNotifications" 
  ] })
  async load() {
    const storage = await browser.storage.local.get();
    const settings = storage.settings as Settings;
    return { 
      _theme: settings?.theme || defaults.theme,
      _accent: settings?.accent || defaults.accent,
      _wide: settings?.wide === undefined ? false : settings.wide,
      _enablePolling: settings?.enablePolling === undefined ? false : settings.enablePolling,
      _pollingInterval: settings?.pollingInterval || defaults.pollingInterval,
      _desktopNotifications: settings?.desktopNotifications === undefined ? false : settings.desktopNotifications
    };
  }

  @Action
  async save() {
    console.log(this._enablePolling)
    browser.storage.local.set({ settings: {
      theme: this._theme,
      accent: this._accent,
      wide: this._wide,
      enablePolling: this._enablePolling,
      pollingInterval: this._pollingInterval,
      desktopNotifications: this._desktopNotifications,
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

  @Mutation
  setPollingEnabled(enabled: boolean) {
    this._enablePolling = enabled;
  }

  @Mutation
  setPollingInterval(interval: number) {
    this._pollingInterval = interval;;
  }

  @Mutation
  setDesktopNotifications(enabled: boolean) {
    this._desktopNotifications = enabled;
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

  get enablePolling(): boolean {
    return this._enablePolling;
  }

  get pollingInterval(): number {
    return this._pollingInterval;
  }

  get desktopNotifications(): boolean {
    return this._desktopNotifications;
  }
}