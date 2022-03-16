<script type="ts">
  import { link } from "svelte-spa-router";
  import Icon from "svelte-fa";
  import { faNotesMedical, faPlus, faRedo } from "@fortawesome/free-solid-svg-icons";
  import { loggedIn } from "$lib/store";
  import type { SearchResult } from "$lib/graphql";
  import { hexToRgb } from "$lib/util";
  import Tooltip from "./Tooltip.svelte";
  import Section from "./Section.svelte";
  import anilistLogo from "$assets/anilist.svg";

  export let title: string;
  export let results: SearchResult["media"];

  function setStatus(status: SearchResult["media"][0]["mediaListEntry"]["status"]) {
    // TODO
  }

  function canAddPlanning(media: SearchResult["media"][0]): boolean {
    return media.mediaListEntry === null;
  }

  function canAddCurrent(media: SearchResult["media"][0]): boolean {
    if (media.status === "NOT_YET_RELEASED")
      return false;
      
    if (!media.mediaListEntry)
      return true;
    
    const status = media.mediaListEntry.status;
    return ![ "CURRENT", "COMPLETED", "REPEATING" ].includes(status);
  }

  function canRewatch(media: SearchResult["media"][0]): boolean {
    return media.mediaListEntry?.status === "COMPLETED";
  }
</script>

{#if results.length > 0}
  <Section raise={false} {title}>
    <div class="flex flex-col space-y-4">
      {#each results as media}
        <div class="w-full h-16 flex items-center space-x-2 bg-foreground rounded-md overflow-hidden">
          <div class="w-12 h-full flex-none aspect-[3/4] bg-cover" style="background-image:url({media.coverImage.medium})" />
          <a href="#/media/{media.id}" class="flex-1 hover:text-variable transition-colors" style="--color-variable:{hexToRgb(media.coverImage.color)}" use:link>
            <h2 class="line-clamp-2 font-medium text-sm">{media.title.userPreferred}</h2>
          </a>
          {#if $loggedIn}
            <div class="flex-none w-1/6 grid gap-x-1 grid-cols-3 items-center text-lg">
              <Tooltip content="View on AniList" placement="left">
                <a href={media.siteUrl} target="blank">
                  <img class="aspect-square bg-overlay rounded-md" src={anilistLogo} alt="AniList Logo">
                </a>
              </Tooltip>
              {#if canAddPlanning(media)}
                <Tooltip content="Add to planning" placement="left">
                  <div on:click={() => setStatus("PLANNING")}>
                    <Icon icon={faNotesMedical} />
                  </div>
                </Tooltip>
              {/if}
              {#if canAddCurrent(media)}
                <Tooltip content="Add to current" placement="left">
                  <div on:click={() => setStatus("CURRENT")}>
                    <Icon icon={faPlus} />
                  </div>
                </Tooltip>
              {/if}
              {#if canRewatch(media)}
                <Tooltip content="Add to repeating" placement="left">
                  <div on:click={() => setStatus("REPEATING")}>
                    <Icon icon={faRedo} />
                  </div>
                </Tooltip>
              {/if}
            </div>
          {:else}
            <div />
          {/if}
        </div>
      {/each}
    </div>
  </Section>
{/if}