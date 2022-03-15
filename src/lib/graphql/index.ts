import { token } from "$lib/store";
import { createClient } from "@urql/svelte";
import { get } from "svelte/store";

export const client = createClient({
  url: "https://graphql.anilist.co",
  fetchOptions: () => {
    const storedToken = get(token);
    const headers: Record<string, string> = {};

    if (storedToken)
      headers.Authorization = `Bearer ${storedToken}`;

    return {
      headers
    };
  },
});

export * from "./query/Viewer";
export * from "./query/Search";
export * from "./query/Media";
export * from "./query/GetRecentMedia";
export * from "./query/MediaList";