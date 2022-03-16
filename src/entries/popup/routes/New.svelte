<script lang="ts">
  import type { OperationStore } from "@urql/svelte";
  import { operationStore, query } from "@urql/svelte";
  import Lazy from "svelte-lazy";
  import { link } from "svelte-spa-router";
  import type { RecentMedia } from "$lib/graphql";
  import { RecentMediaQuery } from "$lib/graphql";
  import { extensionConfig } from "$lib/store";
  import Section from "$lib/components/Section.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import Error from "$lib/components/Error.svelte";
  import { hexToRgb, textify } from "$lib/util";
  import Tooltip from "$lib/components/Tooltip.svelte";

  const recentAnime = operationStore<{ Page: RecentMedia }>(RecentMediaQuery, {
    type: "ANIME",
    sort: [ "ID_DESC" ],
    perPage: $extensionConfig.theme.wide ? 12 : 8,
  }, { pause: true });
  const recentManga = operationStore<{ Page: RecentMedia }>(RecentMediaQuery, {
    type: "MANGA",
    sort: [ "ID_DESC" ],
    formatIn: [ "MANGA", "ONE_SHOT" ],
    perPage: $extensionConfig.theme.wide ? 12 : 8,
  }, { pause: true });
  const recentNovels = operationStore<{ Page: RecentMedia }>(RecentMediaQuery, {
    type: "MANGA",
    sort: [ "ID_DESC" ],
    formatIn: [ "NOVEL" ],
    perPage: $extensionConfig.theme.wide ? 12 : 8,
  }, { pause: true });

  query(recentAnime);
  query(recentManga);
  query(recentNovels);

  function runQuery(query: OperationStore<{ Page: RecentMedia }>) {
    query.context.pause = false;
    query.reexecute();
  }
</script>

<div class="flex flex-col space-y-2">
  <Lazy onload={() => runQuery(recentAnime)} fadeOption={{ duration: 200 }} height={450} offset={0}>
    {#if $recentAnime.fetching}
      <Loader />
    {:else if $recentAnime.error}
      <Error text={$recentAnime.error.message} />
    {:else}
      <Section raise={false}>
        <a slot="title" class="hover:text-accent transition-colors" href="https://anilist.co/search/anime/new" target="_blank">New Anime</a>
        <div class="grid gap-x-2 gap-y-4 {$extensionConfig.theme.wide ? "grid-cols-6" : "grid-cols-4"}">
          {#each $recentAnime.data.Page.media as media}
            <Tooltip placement="right">
              <div slot="content" class="flex flex-col w-48">
                <h2 class="font-semibold text-sm mb-2 leading-tight">{media.title.userPreferred}</h2>
                <span>
                  {textify(media.format)} &#183; {textify(media.status)}
                </span>
              </div>
              <a class="flex flex-col group" style="--color-variable:{hexToRgb(media.coverImage.color) || "var(--color-accent)"}" href="#/media/{media.id}" use:link>
                <div class="bg-cover bg-center aspect-[3/4] rounded-md hover:shadow-md transition-all" style="background-image:url({media.coverImage.extraLarge})">
    
                </div>
              </a>
            </Tooltip>
          {/each}
        </div>
      </Section>
    {/if}
  </Lazy>

  <Lazy onload={() => runQuery(recentManga)} fadeOption={{ duration: 200 }} height={450} offset={0}>
    {#if $recentManga.fetching}
      <Loader />
    {:else if $recentManga.error}
      <Error text={$recentManga.error.message} />
    {:else}
      <Section raise={false}>
        <a slot="title" class="hover:text-accent transition-colors" href="https://anilist.co/search/manga?format=MANGA&format=ONE_SHOT&sort=ID_DESC" target="_blank">New Manga</a>
        <div class="grid gap-x-2 gap-y-4 {$extensionConfig.theme.wide ? "grid-cols-6" : "grid-cols-4"}">
          {#each $recentManga.data.Page.media as media}
          <Tooltip placement="right">
            <div slot="content" class="flex flex-col w-48">
              <h2 class="font-semibold text-sm mb-2 leading-tight">{media.title.userPreferred}</h2>
              <span>
                {textify(media.format)} &#183; {textify(media.status)}
              </span>
            </div>
            <a class="flex flex-col group" style="--color-variable:{hexToRgb(media.coverImage.color) || "var(--color-accent)"}" href="#/media/{media.id}" use:link>
              <div class="bg-cover bg-center aspect-[3/4] rounded-md hover:shadow-md transition-all" style="background-image:url({media.coverImage.extraLarge})">
  
              </div>
            </a>
          </Tooltip>
          {/each}
        </div>
      </Section>
    {/if}
  </Lazy>

  <Lazy onload={() => runQuery(recentNovels)} fadeOption={{ duration: 200 }} height={450} offset={0}>
    {#if $recentNovels.fetching}
      <Loader />
    {:else if $recentNovels.error}
      <Error text={$recentNovels.error.message} />
    {:else}
      <Section raise={false}>
        <a slot="title" class="hover:text-accent transition-colors" href="https://anilist.co/search/manga?format=NOVEL&sort=ID_DESC" target="_blank">New Light Novels</a>
        <div class="grid gap-x-2 gap-y-4 {$extensionConfig.theme.wide ? "grid-cols-6" : "grid-cols-4"}">
          {#each $recentNovels.data.Page.media as media}
          <Tooltip placement="right">
            <div slot="content" class="flex flex-col w-48">
              <h2 class="font-semibold text-sm mb-2 leading-tight">{media.title.userPreferred}</h2>
              <span>
                {textify(media.format)} &#183; {textify(media.status)}
              </span>
            </div>
            <a class="flex flex-col group" style="--color-variable:{hexToRgb(media.coverImage.color) || "var(--color-accent)"}" href="#/media/{media.id}" use:link>
              <div class="bg-cover bg-center aspect-[3/4] rounded-md hover:shadow-md transition-all" style="background-image:url({media.coverImage.extraLarge})">
  
              </div>
            </a>
          </Tooltip>
          {/each}
        </div>
      </Section>
    {/if}
  </Lazy>
</div>