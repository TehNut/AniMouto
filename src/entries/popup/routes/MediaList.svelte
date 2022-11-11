<script lang="ts">
  import Icon from "svelte-fa";
  import { faCompressAlt, faExpandAlt, faRedo, faStar } from "@fortawesome/free-solid-svg-icons";
  import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
  import { getContextClient, queryStore } from "@urql/svelte";
  import { GetUserMediaListDocument, MediaType, type MediaList } from "@anilist/graphql";
  import { user, extensionConfig } from "$lib/store";
  import { parseSeconds, readableTime } from "$lib/util";
  import QueryContainer from "$lib/components/QueryContainer.svelte";
  import Section from "$lib/components/Section.svelte";
  import MediaListCard from "$lib/components/MediaListCard.svelte";
  import Tooltip from "$lib/components/Tooltip.svelte";

  const client = getContextClient();

  $: animeList = queryStore({
    client,
    query: GetUserMediaListDocument,
    variables: {
      id: $user.id,
      type: MediaType.ANIME,
      starred: $extensionConfig.list.showStarred ? $extensionConfig.list.starredMedia : undefined,
    }
  });
  $: mangaList = queryStore({
    client,
    query: GetUserMediaListDocument,
    variables: {
      id: $user.id,
      type: MediaType.MANGA,
      starred: $extensionConfig.list.showStarred ? $extensionConfig.list.starredMedia : undefined,
    }
  });

  $: showStarred = $extensionConfig.list?.showStarred;
  $: combineAnime = $extensionConfig.list?.combineAnime || showStarred;
  $: airingAnime = !combineAnime ? ($animeList.data?.Page?.mediaList || [])
    .filter(l => l != null)
    .filter(l => l.media.status === "RELEASING")
    .filter(l => l.status !== "COMPLETED")
    .sort((a, b) => a.media.nextAiringEpisode?.timeUntilAiring - b.media.nextAiringEpisode?.timeUntilAiring) as MediaList[] : [];
  $: watchingAnime = combineAnime ? ($animeList.data?.Page.mediaList || []) as MediaList[] : ($animeList.data?.Page?.mediaList || [])
    .filter(l => l != null)
    .filter(l => l.media.status !== "RELEASING")
    .filter(l => l.status !== "COMPLETED") as MediaList[];
  $: reading = ($mangaList.data?.Page.mediaList || [])
    .filter(l => l != null)
    .filter(l => l.status !== "COMPLETED");
  $: airingBehind = getTotalBehind(airingAnime || []);
  $: watchingBehind = getTotalBehind(watchingAnime || []);

  function refreshLists() {
    queryStore({
      client,
      query: GetUserMediaListDocument,
      variables: {
        id: $user.id,
        type: MediaType.ANIME,
      },
      requestPolicy: "network-only"
    });
    queryStore({
      client,
      query: GetUserMediaListDocument,
      variables: {
        id: $user.id,
        type: MediaType.MANGA,
      },
      requestPolicy: "network-only"
    });
  }

  function getTotalBehind(entries: MediaList[]) {
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

<div class="absolute z-10 top-3 right-3 flex space-x-2 text-text-200">
  {#if !showStarred}
    <Tooltip placement="bottom" content="{combineAnime ? "Split" : "Combine"} airing and completed anime">
      <button class="hover:text-accent transition-colors" on:click={() => $extensionConfig.list = { ...$extensionConfig.list, combineAnime: !combineAnime } }>
        <Icon icon={combineAnime ? faExpandAlt : faCompressAlt} />
      </button>
    </Tooltip>
  {/if}
  {#if $extensionConfig.list.starredMedia.length > 0}
    <Tooltip placement="bottom" content={showStarred ? "Show standard overview" : "Show starred media"}>
      <button class="hover:text-yellow transition-colors" on:click={() => $extensionConfig.list = { ...$extensionConfig.list, showStarred: !showStarred } }>
        <Icon icon={showStarred ? faStar : faStarOutline} />
      </button>
    </Tooltip>
  {/if}
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
          {#if airingBehind.minutesBehind > 0}
            <span class="text-xs text-red">
              {readableTime(parseSeconds(airingBehind.minutesBehind * 60))} behind
              ({airingBehind.episodesBehind} Episodes)
            </span>
          {/if}
        </div>
        <div class="grid {$extensionConfig.theme.wide ? "grid-cols-6" : "grid-cols-4"} gap-4">
          {#each (airingAnime || []) as listEntry (listEntry.id)}
            <MediaListCard type="ANIME" {listEntry} />
          {/each}
        </div>
      </Section>
    {/if}
    {#if watchingAnime?.length > 0}
      <Section raise={false}>
        <div slot="title" class="flex items-center space-x-2">
          {#if !combineAnime}
            <Tooltip placement="top" content="Anime that have finished releasing">
              Anime in Progress
            </Tooltip>
          {:else}
            <span>Anime in Progress</span>
          {/if}
          {#if watchingBehind.minutesBehind > 0}
            <span class="text-xs text-orange">
              {readableTime(parseSeconds(watchingBehind.minutesBehind * 60))} left
              ({watchingBehind.episodesBehind} Episodes)
            </span>
          {/if}
        </div>
        <div class="grid {$extensionConfig.theme.wide ? "grid-cols-6" : "grid-cols-4"} gap-4">
          {#each (watchingAnime || []) as listEntry (listEntry.id)}
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
          {#each reading as listEntry (listEntry.id)}
            <MediaListCard type="MANGA" {listEntry} />
          {/each}
        </div>
      </Section>
    {/if}
  </QueryContainer>
</div>