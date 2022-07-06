import { derived, writable } from "svelte/store";
import type { JwtPayload } from "jwt-decode";
import jwtDecode from "jwt-decode";
import { client } from "$lib/graphql";
import { GetViewerDocument, type User, type UserAvatar } from "@anilist/graphql";

type StoredUser = Pick<User, "id" | "name" | "siteUrl"> & {
  avatar?: Pick<UserAvatar, "large">,
};

const PLACEHOLDER_USER: StoredUser = {
  id: 0,
  name: "Foo",
  avatar: {
    large: "https://s4.anilist.co/file/anilistcdn/user/avatar/large/default.png",
  },
  siteUrl: "https://anilist.co"
};

export const token = writable<string>(null);
export const user = createUserStore();
export const loggedIn = derived(token, token => {
  if (token === null)
    return false;

  const { exp } = jwtDecode<JwtPayload>(token);
  return exp ? exp - Math.floor(Date.now() / 1000) >= 0 : false;
});

function createUserStore() {
  const { set, subscribe, update } = writable<StoredUser>(PLACEHOLDER_USER);

  return {
    set,
    subscribe,
    update,
    fetch: async () => {
      const response = await client.query(GetViewerDocument).toPromise();
      set(response.data.Viewer);
    },
    logout() {
      set(PLACEHOLDER_USER);
      token.set(null);
    },
    reset: () => {
      set(PLACEHOLDER_USER);
    }
  }
}