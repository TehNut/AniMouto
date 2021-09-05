import browser from "webextension-polyfill";
import { Module, VuexModule, MutationAction, Mutation } from "vuex-module-decorators";
import Vue from "vue";
import { SupportedLanguages } from '@/i18n/Lookup';

@Module({
  namespaced: true
})
export default class RootModule extends VuexModule {
  _lastPage: string = "login";
  _unreadNotificationCount: number = 0;
  _language: SupportedLanguages = SupportedLanguages.ENGLISH;

  @MutationAction({ mutate: [ "_lastPage", "_unreadNotificationCount", "_language" ] })
  async load() {
    const storage = await browser.storage.local.get({
      lastPage: "login",
      unreadNotificationCount: 0,
      language: "ENGLISH"
    });
    return { 
      _lastPage: storage.lastPage, 
      _unreadNotificationCount: storage.unreadNotificationCount,
      _language: storage.language
    };
  }

  @MutationAction({ mutate: [ "_lastPage" ] })
  async changePage(lastPage: string, app: Vue) {
    await browser.storage.local.set({ lastPage });
    return { _lastPage: lastPage }
  }

  @MutationAction({ mutate: [ "_unreadNotificationCount" ] })
  async clearUnreadNotifications() {
    await browser.storage.local.set({ unreadNotificationCount: 0 });
    await browser.browserAction.setBadgeText({ text: "" });
    return { _unreadNotificationCount: 0 };
  }

  @MutationAction({ mutate: [ "_language" ] })
  async setLanguage(language: SupportedLanguages) {
    await browser.storage.local.set({ language });
    return { _language: language };
  }

  @Mutation
  setNotificationCount(notificationCount: number) {
    this._unreadNotificationCount = notificationCount;
  }

  get lastPage() {
    return this._lastPage;
  }

  get unreadNotificationCount() {
    return this._unreadNotificationCount;
  }

  get language() {
    return this._language;
  }
}