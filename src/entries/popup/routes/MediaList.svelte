<script lang="ts">
  import { operationStore, query } from "@urql/svelte";
  import type { MediaListResult } from "$lib/graphql";
  import { MediaListQuery } from "$lib/graphql";
  import { user } from "$lib/store";
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

  $: airingAnime = $animeList.data?.Page.mediaList
    .filter(l => l.media.status === "RELEASING")
    .sort((a, b) => a.media.nextAiringEpisode?.timeUntilAiring - b.media.nextAiringEpisode?.timeUntilAiring)
  $: watchingAnime = $animeList.data?.Page.mediaList.filter(l => l.media.status !== "RELEASING")
</script>

<div class="flex flex-col space-y-4">
  <QueryContainer query={animeList}>
    <Section raise={false}>
      <div slot="title" class="flex items-center justify-between">
        <Tooltip placement="top" content="Currently airing anime">
          <a href="https://anilist.co/airing" target="_blank">Airing</a>
        </Tooltip>
      </div>
      <div class="grid grid-cols-4 gap-4">
        {#each (airingAnime || []) as listEntry}
          <MediaListCard {listEntry} />
        {/each}
      </div>
    </Section>
    <Section raise={false}>
      <div slot="title" class="flex items-center justify-between">
        <Tooltip placement="top" content="Anime that has finished releasing">
          Anime in Progress
        </Tooltip>
      </div>
      <div class="grid grid-cols-4 gap-4">
        {#each (watchingAnime || []) as listEntry}
          <MediaListCard {listEntry} />
        {/each}
      </div>
    </Section>
  </QueryContainer>
  <QueryContainer query={mangaList}>
    <Section raise={false}>
      <div slot="title" class="flex items-center justify-between">
        Manga in Progress
      </div>
      <div class="grid grid-cols-4 gap-4">
        {#each $mangaList.data.Page.mediaList as listEntry}
          <MediaListCard {listEntry} />
        {/each}
      </div>
    </Section>
  </QueryContainer>
</div>