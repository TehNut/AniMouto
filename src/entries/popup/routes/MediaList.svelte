<script lang="ts">
  import Icon from "svelte-fa";
  import { faCompressAlt, faExpandAlt } from "@fortawesome/free-solid-svg-icons";
  import { operationStore } from "@urql/svelte";
  import type { MediaListResult } from "$lib/graphql";
  import { MediaListQuery } from "$lib/graphql";
  import { user, extensionConfig } from "$lib/store";
  import QueryContainer from "$lib/components/QueryContainer.svelte";
  import Section from "$lib/components/Section.svelte";
  import MediaListCard from "$lib/components/MediaListCard.svelte";
  import Tooltip from "$lib/components/Tooltip.svelte";

  const animeList = operationStore<{ Page: MediaListResult }>(MediaListQuery, {
    id: $user.id,
    type: "ANIME"
  });
  const mangaList = operationStore<{ Page: MediaListResult }>(MediaListQuery, {
    id: $user.id,
    type: "MANGA"
  });

  $: combineAnime = $extensionConfig.list?.combineAnime;
  $: airingAnime = !combineAnime ? $animeList.data?.Page?.mediaList
    .filter(l => l.media.status === "RELEASING")
    .sort((a, b) => a.media.nextAiringEpisode?.timeUntilAiring - b.media.nextAiringEpisode?.timeUntilAiring) : [];
  $: watchingAnime = combineAnime ? $animeList.data?.Page.mediaList : $animeList.data?.Page?.mediaList
    .filter(l => l.media.status !== "RELEASING");
</script>

<div class="absolute top-3 right-3">
  <Tooltip placement="bottom" content="{combineAnime ? "Split" : "Combine"} airing and completed anime">
    <button class="hover:text-accent transition-colors" on:click={() => $extensionConfig.list = { ...$extensionConfig.list, combineAnime: !combineAnime } }>
      <Icon icon={combineAnime ? faExpandAlt : faCompressAlt} />
    </button>
  </Tooltip>
</div>
<div class="flex flex-col space-y-4">
  <QueryContainer query={animeList}>
    {#if airingAnime?.length > 0}
      <Section raise={false}>
        <div slot="title" class="flex items-center justify-between">
          <Tooltip placement="top" content="Currently airing anime">
            <a href="https://anilist.co/airing" target="_blank">Airing</a>
          </Tooltip>
        </div>
        <div class="grid grid-cols-4 gap-4">
          {#each (airingAnime || []) as listEntry}
            <MediaListCard type="ANIME" {listEntry} />
          {/each}
        </div>
      </Section>
    {/if}
    {#if watchingAnime?.length > 0}
      <Section raise={false}>
        <div slot="title" class="flex items-center justify-between">
          {#if !$extensionConfig.list?.combineAnime}
            <Tooltip placement="top" content="Anime that has finished releasing">
              Anime in Progress
            </Tooltip>
          {:else}
            Anime in Progress
          {/if}
        </div>
        <div class="grid grid-cols-4 gap-4">
          {#each (watchingAnime || []) as listEntry}
            <MediaListCard type="ANIME" {listEntry} />
          {/each}
        </div>
      </Section>
    {/if}
  </QueryContainer>
  <QueryContainer query={mangaList}>
    {#if $mangaList.data?.Page?.mediaList?.length > 0}
      <Section raise={false}>
        <div slot="title" class="flex items-center justify-between">
          Manga in Progress
        </div>
        <div class="grid grid-cols-4 gap-4">
          {#each $mangaList.data.Page.mediaList as listEntry}
            <MediaListCard type="MANGA" {listEntry} />
          {/each}
        </div>
      </Section>
    {/if}
  </QueryContainer>
</div>