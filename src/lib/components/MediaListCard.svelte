<script lang="ts">
  import { link } from "svelte-spa-router";
  import { mutation } from "@urql/svelte";
  import Lazy from "svelte-lazy";
  import { IncrementProgressMutation, type MediaListResult } from "$lib/graphql";
  import { hexToRgb, readableTime, parseSeconds } from "$lib/util";
  import Tooltip from "$lib/components/Tooltip.svelte";

  export let listEntry: MediaListResult["mediaList"][0];
  export let type: "ANIME" | "MANGA";

  const incrementProgressMutation = mutation({
    query: IncrementProgressMutation,
  });

  $: behindCount = listEntry.media.nextAiringEpisode ? listEntry.media.nextAiringEpisode?.episode - 1 - listEntry.progress : 0;

  async function incrementProgress() {
    const maxProgress = listEntry.media.episodes || listEntry.media.chapters;
    const willFinish = listEntry.progress + 1 >= (maxProgress || Infinity);
    incrementProgressMutation({
      listId: listEntry.id,
      mediaId: listEntry.media.id,
      progress: listEntry.progress + 1,
      status: willFinish ? "COMPLETED" : undefined,
      volume: willFinish && listEntry.media.volumes && type === "MANGA" ? listEntry.media.volumes : undefined
    });
  }
</script>

<Tooltip placement="right">
  <div slot="content" class="flex flex-col w-48">
    <h2 class="font-semibold text-sm mb-2 leading-tight">{listEntry.media.title.userPreferred}</h2>
    {#if behindCount > 0}
      <span class="text-red mb-2">{behindCount} episode{behindCount === 1 ? "" : "s"} behind</span>
    {/if}
    <span class="justify-self-end">Progress: {listEntry.progress}{listEntry.media.episodes || listEntry.media.chapters ? "/" + listEntry.media.episodes || listEntry.media.chapters : ""}</span>
  </div>
  <a href="#/media/{listEntry.media.id}" use:link>
    <div 
      class="relative group bg-variable aspect-[3/4] rounded-md overflow-hidden" 
      style="--color-variable:{hexToRgb(listEntry.media.coverImage.color) || "var(--color-accent)"}"
    >
      <Lazy fadeOption={{ duration: 200 }}>
        <img class="h-full aspect-[3/4] object-cover object-center" src="{listEntry.media.coverImage.extraLarge}" alt="Key visual">
      </Lazy>
      <div class="absolute w-full bottom-0 px-2 bg-overlay/70 text-white font-semibold text-center text-xs opacity-0 group-hover:opacity-100 transition-all">
        <button on:click|stopPropagation|preventDefault={incrementProgress} class="px-2 py-2 hover:font-bold hover:text-variable transition-all">
          {listEntry.progress} +
        </button>
      </div>
      {#if listEntry.media.nextAiringEpisode}
        <div class="absolute w-full bottom-0 p-2 bg-overlay/70 text-white font-medium text-center text-xs group-hover:opacity-0 pointer-events-none transition-all">
          Ep {listEntry.media.nextAiringEpisode.episode}
          <br />
          {readableTime(parseSeconds(listEntry.media.nextAiringEpisode.timeUntilAiring), { includeSeconds: false, includeWeeks: true })}
        </div>
      {/if}
      {#if listEntry.media.nextAiringEpisode?.episode - 1 > listEntry.progress}
        <div class="absolute w-full bottom-0 h-1 bg-red" />
      {/if}
    </div>
  </a>
</Tooltip>