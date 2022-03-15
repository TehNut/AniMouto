import { writable } from "svelte/store";
import type { ExtensionConfiguration } from "$lib/model";
import { Theme, Accent } from "$lib/model";

export const lastPage = writable("/");
export const extensionConfig = writable<ExtensionConfiguration>({
  theme: {
    primary: Theme.LIGHT,
    accent: Accent.BLUE,
    wide: false
  },
  notifications: {
    enablePolling: true,
    pollingInterval: 1,
    desktopNotifications: false
  }
});

export * from "./auth";