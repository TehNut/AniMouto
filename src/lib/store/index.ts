import { writable } from "svelte/store";
import { withPrevious } from "svelte-previous";
import type { ExtensionConfiguration } from "$lib/model";
import { Theme, Accent } from "$lib/model";

export const lastPage = writable("/");
export const unreadNotifications = writable(0);
const [ currentExtensionConfig_, previousExtensionConfig_ ] = withPrevious<ExtensionConfiguration>({
  list: {
    combineAnime: false
  },
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

export const extensionConfig = currentExtensionConfig_;
export const previousExtensionConfig = previousExtensionConfig_;

export * from "./auth";