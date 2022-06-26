<script lang="ts">
  import Icon from "svelte-fa";
  import { faCompressAlt, faExpandAlt, faRedo } from "@fortawesome/free-solid-svg-icons";
  import { getContextClient, queryStore } from "@urql/svelte";
  import type { MediaListResult } from "$lib/graphql";
  import { MediaListQuery } from "$lib/graphql";
  import { user, extensionConfig } from "$lib/store";
  import { parseSeconds, readableTime } from "$lib/util";
  import QueryContainer from "$lib/components/QueryContainer.svelte";
  import Section from "$lib/components/Section.svelte";
  import MediaListCard from "$lib/components/MediaListCard.svelte";
  import Tooltip from "$lib/components/Tooltip.svelte";

  const client = getContextClient();

  $: animeList = queryStore<{ Page: MediaListResult }>({
    client,
    query: MediaListQuery, 
    variables: {
      id: $user.id,
      type: "ANIME"
    }
  });
  $: mangaList = queryStore<{ Page: MediaListResult }>({
    client,
    query: MediaListQuery, 
    variables: {
      id: $user.id,
      type: "MANGA"
    }
  });

  $: combineAnime = $extensionConfig.list?.combineAnime;
  $: airingAnime = !combineAnime ? ($animeList.data?.Page?.mediaList || [])
    .filter(l => l.media.status === "RELEASING")
    .filter(l => l.status !== "COMPLETED")
    .sort((a, b) => a.media.nextAiringEpisode?.timeUntilAiring - b.media.nextAiringEpisode?.timeUntilAiring) : [];
  $: watchingAnime = combineAnime ? ($animeList.data?.Page.mediaList || []) : ($animeList.data?.Page?.mediaList || [])
    .filter(l => l.media.status !== "RELEASING")
    .filter(l => l.status !== "COMPLETED");
  $: reading = ($mangaList.data?.Page.mediaList || [])
    .filter(l => l.status !== "COMPLETED");
  $: airingBehind = getTotalBehind(airingAnime || []);
  $: watchingBehind = getTotalBehind(watchingAnime || []);

  function refreshLists() {
    queryStore({
      client,
      query: MediaListQuery,
      variables: {
        id: $user.id,
        type: "ANIME"
      },
      requestPolicy: "network-only"
    });
    queryStore({
      client,
      query: MediaListQuery,
      variables: {
        id: $user.id,
        type: "MANGA"
      },
      requestPolicy: "network-only"
    });
  }

  function getTotalBehind(entries: MediaListResult["mediaList"]) {
    return entries
      .map(e => ({ behind: (e.media.nextAiringEpisode ? e.media.nextAiringEpisode.episode - 1 : e.media.episodes) - e.progress, duration: e.media.duration }))
      .filter(e => e.behind > 0)
      .reduce((result, curr) => {
        result.episodesBehind += curr.behind;
        result.minutesBehind += curr.behind * curr.duration;
        return result;
      }, { episodesBehind: 0, minutesBehind: 0 });
  };
</script>

<div class="absolute top-3 right-3 flex space-x-2">
  <Tooltip placement="bottom" content="{combineAnime ? "Split" : "Combine"} airing and completed anime">
    <button class="hover:text-accent transition-colors" on:click={() => $extensionConfig.list = { ...$extensionConfig.list, combineAnime: !combineAnime } }>
      <Icon icon={combineAnime ? faExpandAlt : faCompressAlt} />
    </button>
  </Tooltip>
  <Tooltip placement="bottom" content="Refresh list">
    <button class="hover:text-accent transition-colors" on:click={() => refreshLists() }>
      <Icon icon={faRedo} spin={$animeList.fetching || $mangaList.fetching} />
    </button>
  </Tooltip>
</div>
<div class="flex flex-col space-y-4">
  <QueryContainer query={animeList}>
    {#if airingAnime?.length > 0}
      <Section raise={false}>
        <div slot="title" class="flex items-center space-x-2">
          <Tooltip placement="top" content="Currently airing anime">
            <a href="https://anilist.co/airing" target="_blank">Airing</a>
          </Tooltip>
          <span class="text-xs text-red">
            {readableTime(parseSeconds(airingBehind.minutesBehind * 60))} behind
            ({airingBehind.episodesBehind} Episodes)
          </span>
        </div>
        <div class="grid {$extensionConfig.theme.wide ? "grid-cols-6" : "grid-cols-4"} gap-4">
          {#each (airingAnime || []) as listEntry}
            <MediaListCard type="ANIME" {listEntry} />
          {/each}
        </div>
      </Section>
    {/if}
    {#if watchingAnime?.length > 0}
      <Section raise={false}>
        <div slot="title" class="flex items-center space-x-2">
          {#if !$extensionConfig.list?.combineAnime}
            <Tooltip placement="top" content="Anime that have finished releasing">
              Anime in Progress
            </Tooltip>
          {:else}
            <span>Anime in Progress</span>
          {/if}
          <span class="text-xs text-orange">
            {readableTime(parseSeconds(watchingBehind.minutesBehind * 60))} left
            ({watchingBehind.episodesBehind} Episodes)
          </span>
        </div>
        <div class="grid {$extensionConfig.theme.wide ? "grid-cols-6" : "grid-cols-4"} gap-4">
          {#each (watchingAnime || []) as listEntry}
            <MediaListCard type="ANIME" {listEntry} />
          {/each}
        </div>
      </Section>
    {/if}
  </QueryContainer>
  <QueryContainer query={mangaList}>
    {#if reading?.length > 0}
      <Section raise={false}>
        <div slot="title" class="flex items-center justify-between">
          Manga in Progress
        </div>
        <div class="grid {$extensionConfig.theme.wide ? "grid-cols-6" : "grid-cols-4"} gap-4">
          {#each reading as listEntry}
            <MediaListCard type="MANGA" {listEntry} />
          {/each}
        </div>
      </Section>
    {/if}
  </QueryContainer>
</div>