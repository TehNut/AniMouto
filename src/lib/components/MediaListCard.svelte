<script lang="ts">
  import type { MediaListResult } from "$lib/graphql";
  import { hexToRgb } from "$lib/util";
  import Tooltip from "$lib/components/Tooltip.svelte";

  export let listEntry: MediaListResult["mediaList"][0];

  function getBehindCount() {
    if (!listEntry.media.nextAiringEpisode)
      return 0;
    
    return listEntry.media.nextAiringEpisode?.episode - 1 - listEntry.progress;
  }

  async function incrementProgress() {
    console.log("increment")
  }
</script>

<Tooltip placement="right">
  <div slot="content" class="flex flex-col w-48">
    <h2 class="font-semibold text-sm mb-2 leading-tight">{listEntry.media.title.userPreferred}</h2>
    {#if getBehindCount() > 0}
      <span class="text-red mb-2">{getBehindCount()} episode{getBehindCount() === 1 ? "" : "s"} behind</span>
    {/if}
    <span class="justify-self-end">Progress: {listEntry.progress}{listEntry.media.episodes || listEntry.media.chapters ? "/" + listEntry.media.episodes || listEntry.media.chapters : ""}</span>
  </div>
  <a href="#/media/{listEntry.media.id}">
    <div 
      class="relative group bg-variable bg-cover bg-center aspect-[3/4] rounded-md overflow-hidden" 
      style="--color-variable:{hexToRgb(listEntry.media.coverImage.color) || "var(--color-accent)"};background-image:url({listEntry.media.coverImage.extraLarge})"
    >
      <div class="absolute w-full bottom-0 px-2 bg-overlay/70 text-white font-semibold text-center text-xs opacity-0 group-hover:opacity-100 transition-all">
        <button on:click|preventDefault={incrementProgress} class="px-2 py-2 hover:font-bold hover:text-accent transition-all">
          {listEntry.progress} +
        </button>
      </div>
      {#if listEntry.media.nextAiringEpisode}
        <div class="absolute w-full bottom-0 p-2 bg-overlay/70 text-white font-medium text-center text-xs group-hover:opacity-0 pointer-events-none transition-all">
          Ep {listEntry.media.nextAiringEpisode.episode}
          <br />
          {listEntry.media.nextAiringEpisode.timeUntilAiring}
        </div>
      {/if}
      {#if listEntry.media.nextAiringEpisode?.episode - 1 > listEntry.progress}
        <div class="absolute w-full bottom-0 h-1 bg-red" />
      {/if}
    </div>
  </a>
</Tooltip>