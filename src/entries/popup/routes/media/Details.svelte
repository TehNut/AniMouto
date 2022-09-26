<script lang="ts">
  import type { OperationResultStore } from "@urql/svelte/dist/types/common";
  import { type GetMediaByIdQuery, type FuzzyDate, MediaType } from "@anilist/graphql";
  import MediaDetail from "$lib/components/MediaDetail.svelte";
  import Section from "$lib/components/Section.svelte";
  import { textify } from "$lib/util";

  export let media: OperationResultStore<GetMediaByIdQuery>;

  $: isManga = $media.data?.Media.type === MediaType.MANGA;
  $: studios = $media.data?.Media.studios.edges.filter(s => s.isMain).map(s => s.node);
  $: producers = $media.data?.Media.studios.edges.filter(s => !s.isMain).map(s => s.node);
  $: startDate = formatFuzzyDate($media.data?.Media.startDate);
  $: endDate = formatFuzzyDate($media.data?.Media.endDate);

  function formatFuzzyDate(date?: FuzzyDate): string {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let dateString = "";

    if (!date)
      return null;
    
    if (date.month)
      dateString += months[date.month - 1];

    if (date.day)
      dateString += ` ${date.day}`;

    if (date.year) {
      if (dateString !== "")
        dateString += ", ";

      dateString += date.year;
    }

    return dateString;
  };
</script>


<Section raise={false} title="Dates">
  <div class="grid grid-cols-3 gap-4">
    {#if !isManga}
      <MediaDetail title="Season" data="{textify($media.data.Media.season)} {$media.data.Media.seasonYear}" />
    {/if}
    {#if startDate}
      <MediaDetail title="Start Date" data={startDate} />
    {/if}
    {#if endDate}
      <MediaDetail title="End Date" data={endDate} />
    {/if}
  </div>
</Section>

{#if !isManga}
  <Section raise={false} title="Production">
    <div class="grid {studios.length > 1 || producers.length > 1 ? "grid-cols-2" : "grid-cols-4"} gap-4">
      {#if studios.length > 0}
        <MediaDetail class="col-span-2" title="Studios">
          <div class="flex flex-col">
            {#each studios as studio}
              <a class="line-clamp-1 hover:text-accent transition-colors" href={studio.siteUrl} target="_blank">{studio.name}</a>
            {/each}
          </div>
        </MediaDetail>
      {/if}
      {#if producers.length > 0}
        <MediaDetail class="col-span-2" title="Producers">
          <div class="flex flex-col">
            {#each producers as studio}
              <a class="line-clamp-1 hover:text-accent transition-colors" href={studio.siteUrl} target="_blank">{studio.name}</a>
            {/each}
          </div>
        </MediaDetail>
      {/if}
    </div>
  </Section>
{/if}

<Section raise={false} title="Community">
  <div class="grid grid-cols-4 gap-4">
    {#if $media.data.Media.averageScore}
      <MediaDetail title="Average Score" data={$media.data.Media.averageScore + "%"} description="This is a weighted score." />
    {/if}
    {#if $media.data.Media.meanScore}
      <MediaDetail title="Mean Score" data={$media.data.Media.meanScore + "%"} />
    {/if}
    {#if $media.data.Media.favorites}
      <MediaDetail title="Favorites" data={$media.data.Media.favorites.toLocaleString()} />
    {/if}
    {#if $media.data.Media.popularity}
      <MediaDetail title="Popularity" data={$media.data.Media.popularity.toLocaleString()} />
    {/if}
  </div>
</Section>

<Section raise={false} title="Titles">
  <div class="grid grid-cols-3 gap-4">
    {#if $media.data.Media.title.native}
      <MediaDetail class="col-span-3" title="Native" data={$media.data.Media.title.native} />
    {/if}
    {#if $media.data.Media.title.romaji}
      <MediaDetail class="col-span-3" title="Romaji" data={$media.data.Media.title.romaji} />
    {/if}
    {#if $media.data.Media.title.english}
      <MediaDetail class="col-span-3" title="English" data={$media.data.Media.title.english} />
    {/if}
    {#if $media.data.Media.synonyms && $media.data.Media.synonyms.length > 0}
      <MediaDetail class="col-span-3" title="Synonyms">
        <div class="flex flex-col">
          {#each $media.data.Media.synonyms as synonym}
            <span class="line-clamp-1">{synonym}</span>
          {/each}
        </div>
      </MediaDetail>
    {/if}
  </div>
</Section>