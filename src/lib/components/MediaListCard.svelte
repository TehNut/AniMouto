<script lang="ts">
  import { getContextClient, mutationStore } from "@urql/svelte";
  import { UpdateMediaListProgressDocument, MediaListStatus, type GetUserMediaListQuery } from "@anilist/graphql";
  import { readableTime, parseSeconds } from "$lib/util";
  import MediaCard from "./MediaCard.svelte";

  export let listEntry: GetUserMediaListQuery["Page"]["mediaList"][0];
  export let type: "ANIME" | "MANGA";

  const client = getContextClient();

  $: behindCount = listEntry.media.nextAiringEpisode ? listEntry.media.nextAiringEpisode?.episode - 1 - listEntry.progress : 0;
  $: maxProgress = listEntry.media.episodes || listEntry.media.chapters || "";

  async function incrementProgress() {
    const maxProgress = listEntry.media.episodes || listEntry.media.chapters;
    const willFinish = listEntry.progress + 1 >= (maxProgress || Infinity);
    mutationStore({
      client,
      query: UpdateMediaListProgressDocument,
      variables: {
        listId: listEntry.id,
        mediaId: listEntry.media.id,
        progress: listEntry.progress + 1,
        status: willFinish ? MediaListStatus.COMPLETED : undefined,
        volume: willFinish && listEntry.media.volumes && type === "MANGA" ? listEntry.media.volumes : undefined
      }
    });
  }
</script>

<MediaCard media={listEntry.media}>
  <svelte:fragment slot="tooltip-body">
    {#if behindCount > 0}
      <span class="text-red mb-2">{behindCount} episode{behindCount === 1 ? "" : "s"} behind</span>
    {/if}
    <span class="justify-self-end">Progress: {listEntry.progress}{maxProgress ? "/" + maxProgress : ""}</span>
  </svelte:fragment>
  <div class="absolute w-full bottom-0 px-2 bg-overlay/70 text-white backdrop-blur-sm font-semibold text-center text-xs opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all">
    <button on:click|stopPropagation|preventDefault={incrementProgress} class="px-2 py-2 hover:font-bold hover:text-variable transition-all">
      {listEntry.progress} +
    </button>
  </div>
  {#if listEntry.media.nextAiringEpisode}
    <div class="absolute w-full bottom-0 p-2 bg-overlay/70 text-white backdrop-blur-sm font-medium text-center text-xs group-hover:opacity-0 group-focus-within:opacity-0 pointer-events-none transition-all">
      Ep {listEntry.media.nextAiringEpisode.episode}
      <br />
      {readableTime(parseSeconds(listEntry.media.nextAiringEpisode.timeUntilAiring), { includeSeconds: false, includeWeeks: true })}
    </div>
  {/if}
  {#if listEntry.media.nextAiringEpisode?.episode - 1 > listEntry.progress}
    <div class="absolute w-full bottom-0 h-1 bg-red" />
  {/if}
</MediaCard>