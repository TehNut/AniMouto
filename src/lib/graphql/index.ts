import { token } from "$lib/store";
import { createClient, dedupExchange, fetchExchange, debugExchange, gql } from "@urql/svelte";
import { cacheExchange } from "@urql/exchange-graphcache";
import { get } from "svelte/store";

export const client = createClient({
  url: "https://graphql.anilist.co",
  exchanges: [
    dedupExchange, 
    debugExchange,
    cacheExchange({
      keys: {
        Page: () => null,
        PageInfo: () => null,
        MediaCoverImage: () => null,
        MediaTitle: () => null,
        MediaExternalLink: () => null,
        StaffName: () => null,
        StaffImage: () => null,
        CharacterName: () => null,
        CharacterImage: () => null,
        AiringSchedule: () => null,

      },
      updates: {
        Mutation: {
          SaveMediaListEntry: (result, args, cache, info) => {
            cache.link(
              { __typename: "Media", id: info.variables.media as number }, 
              "mediaListEntry", 
              // @ts-ignore
              { __typename: "MediaList", id: result.SaveMediaListEntry.id as number }
            );
          },
          DeleteMediaListEntry: (result, args, cache, info) => {
            cache.invalidate({ __typename: "MediaList", id: args.id as number });
          },
          ToggleFavourite: (result, args, cache, info) => {
            const data = cache.readFragment(gql`fragment _ on Media { isFavourite }`, {
              id: args.mangaId || args.animeId,
            });
            cache.writeFragment(gql`fragment _ on Media { isFavourite }`, {
              id: args.mangaId || args.animeId,
              isFavourite: !data.isFavourite,
            });
          }
        }
      }
      // storage: // TODO Store cache in background https://formidable.com/open-source/urql/docs/graphcache/offline/#custom-storages
    }), 
    fetchExchange
  ],
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
export * from "./mutation/ToggleFavorite";
export * from "./mutation/ChangeStatus";