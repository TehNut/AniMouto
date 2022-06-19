<script lang="ts">
  import { getContextClient, queryStore } from "@urql/svelte";
  import type { RecentMedia } from "$lib/graphql";
  import { RecentMediaQuery } from "$lib/graphql";
  import { extensionConfig } from "$lib/store";
  import QueryContainer from "$lib/components/QueryContainer.svelte";
  import Section from "$lib/components/Section.svelte";
  import MediaCard from "$lib/components/MediaCard.svelte";

  const recentAnime = queryStore<{ Page: RecentMedia }>({
    client: getContextClient(),
    query: RecentMediaQuery, 
    variables: {
      type: "ANIME",
      sort: [ "ID_DESC" ],
      perPage: $extensionConfig.theme.wide ? 12 : 8,
    }
  });
  const recentManga = queryStore<{ Page: RecentMedia }>({
    client: getContextClient(),
    query: RecentMediaQuery, 
    variables: {
      type: "MANGA",
      sort: [ "ID_DESC" ],
      formatIn: [ "MANGA", "ONE_SHOT" ],
      perPage: $extensionConfig.theme.wide ? 12 : 8,
    }
  });
  const recentNovels = queryStore<{ Page: RecentMedia }>({
    client: getContextClient(),
    query: RecentMediaQuery, 
    variables: {
      type: "MANGA",
      sort: [ "ID_DESC" ],
      formatIn: [ "NOVEL" ],
      perPage: $extensionConfig.theme.wide ? 12 : 8,
    }
  });
</script>

<div class="flex flex-col space-y-2">
  <QueryContainer query={recentAnime}>
    <Section raise={false}>
      <a slot="title" class="hover:text-accent transition-colors" href="https://anilist.co/search/anime/new" target="_blank">New Anime</a>
      <div class="grid gap-x-2 gap-y-4 {$extensionConfig.theme.wide ? "grid-cols-6" : "grid-cols-4"}">
        {#each $recentAnime.data.Page.media as media}
          <MediaCard {media} />
        {/each}
      </div>
    </Section>
  </QueryContainer>

  <QueryContainer query={recentManga}>
    <Section raise={false}>
      <a slot="title" class="hover:text-accent transition-colors" href="https://anilist.co/search/manga?format=MANGA&format=ONE_SHOT&sort=ID_DESC" target="_blank">New Manga</a>
      <div class="grid gap-x-2 gap-y-4 {$extensionConfig.theme.wide ? "grid-cols-6" : "grid-cols-4"}">
        {#each $recentManga.data.Page.media as media}
          <MediaCard {media} />
        {/each}
      </div>
    </Section>
  </QueryContainer>

  <QueryContainer query={recentNovels}>
    <Section raise={false}>
      <a slot="title" class="hover:text-accent transition-colors" href="https://anilist.co/search/manga?format=NOVEL&sort=ID_DESC" target="_blank">New Light Novels</a>
      <div class="grid gap-x-2 gap-y-4 {$extensionConfig.theme.wide ? "grid-cols-6" : "grid-cols-4"}">
        {#each $recentNovels.data.Page.media as media}
          <MediaCard {media} />
        {/each}
      </div>
    </Section>
  </QueryContainer>
</div>