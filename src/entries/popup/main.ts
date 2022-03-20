import { get } from "svelte/store";
import { storage } from "webextension-polyfill";
import App from "./App.svelte";
import type { ExtensionConfiguration, User } from "$lib/model";
import { extensionConfig, lastPage, token, user } from "$lib/store";

async function bootstrap() {
  await loadConfig();
  await loadLastPage();
  await loadToken();

  new App({
    target: document.getElementById("app"),
  });
}

async function loadConfig() {
  const config: ExtensionConfiguration = (await storage.local.get("config")).config;
  if (!config) {
    // Save default config to disk
    await storage.local.set({ config: get(extensionConfig) });
  } else {
    // Load config into store
    extensionConfig.set(config);
    // Save config to disk on every change
    extensionConfig.subscribe(config => storage.local.set({ config }))
  }
}

async function loadLastPage() {
  const page: string = (await storage.local.get("lastPage")).lastPage;
  if (!page)
    await storage.local.set({ lastPage: "/" });
  else
    lastPage.set(page);

  // Save config to disk on every change
  lastPage.subscribe(page => storage.local.set({ lastPage: page }));
}

async function loadToken() {
  const { token: storedToken, cachedUser }: { token: string, cachedUser?: User } = (await storage.local.get([ "token", "cachedUser" ])) as any;
  if (storedToken) {
    token.set(storedToken);
    if (cachedUser?.id > 0)
      user.set(cachedUser);
    else {
      user.fetch();
    }
  }

  token.subscribe(token => storage.local.set({ token }));
  user.subscribe(user => storage.local.set({ cachedUser: user }));
}

bootstrap();