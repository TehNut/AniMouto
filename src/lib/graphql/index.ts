import { createClient, dedupExchange, fetchExchange, gql } from "@urql/svelte";
import { cacheExchange } from "@urql/exchange-graphcache";
import type { CacheExchangeOpts } from "@urql/exchange-graphcache"
import { get } from "svelte/store";
import { token, queryCount } from "$lib/store";
import schema from "./introspection.json";

export const client = createClient({
  url: "https://graphql.anilist.co",
  exchanges: [
    dedupExchange, 
    // documentCacheExchange,
    // debugExchange,
    cacheExchange({
      schema: schema as CacheExchangeOpts["schema"],
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
        UserAvatar: () => null,
        MediaRank: () => null,
        MediaStats: () => null,
        StatusDistribution: () => null,
        ScoreDistribution: () => null,
        FuzzyDate: () => null,
      },
      updates: {
        Mutation: {
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
      },
      // storage: // TODO Store cache in background https://formidable.com/open-source/urql/docs/graphcache/offline/#custom-storages
    }), 
    fetchExchange
  ],
  async fetch(input, init?) {
    const result = await fetch(input, init);
    if(result.headers.has("x-ratelimit-remaining"))
      queryCount.set(parseInt(result.headers.get("x-ratelimit-remaining")))
    return result;
  },
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