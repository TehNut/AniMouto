<script lang="ts">
  import { fade } from "svelte/transition";
  import { params as paramStore } from "svelte-spa-router";
  import { operationStore, mutation } from "@urql/svelte";
  import Icon from "svelte-fa";
  import { faHeart, faNotesMedical, faPlus, faRedo, faTrash, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
  import { MediaQuery, ToggleFavoriteMutation, ChangeStatusMutation, type MediaResult } from "$lib/graphql";
  import QueryContainer from "$lib/components/QueryContainer.svelte";
  import GeneralView from "./General.svelte";
  import DetailsView from "./Details.svelte";
  import StatsView from "./Stats.svelte";
  import SocialView from "./Social.svelte";
  import Tooltip from "$lib/components/Tooltip.svelte";
  import Button from "$lib/components/Button.svelte";
  import { loggedIn } from "$lib/store";
  import { textify, hexToRgb } from "$lib/util";

  export let params: { id: string };
  paramStore.subscribe(p => {
    if (!p)
      return;

    $media.variables = {
      id: parseInt(p.id)
    };
    $media.reexecute();
    // TODO scroll to top
  });

  const media = operationStore<{ Media: MediaResult }>(MediaQuery, {
    id: parseInt(params.id)
  });
  const toggleFavoriteMutation = mutation({
    query: ToggleFavoriteMutation,
  });
  const changeStatusMutation = mutation({
    query: ChangeStatusMutation,
  });

  $: canAddPlanning = $media.data?.Media?.mediaListEntry === null;
  $: canRepeat = $media.data?.Media?.mediaListEntry?.status === "COMPLETED";
  $: canAddCurrent = $media.data?.Media && $media.data.Media.status !== "NOT_YET_RELEASED" && ![ "CURRENT", "COMPLETED", "REPEATING" ].includes($media.data.Media.mediaListEntry?.status);

  let subView: typeof GeneralView | typeof DetailsView | typeof StatsView | typeof SocialView = GeneralView;

  function toggleFavorite() {
    toggleFavoriteMutation({ [$media.data.Media.type.toLowerCase()]: $media.data.Media.id });
  }

  function setStatus(status?: MediaResult["mediaListEntry"]["status"]) {
    changeStatusMutation({ 
      media: $media.data.Media.id,
      list: $media.data.Media.mediaListEntry?.id,
      status,
      delete: !status
    });
  }
</script>

<QueryContainer query={media}>
  <div in:fade={{ duration: 1, delay: 150 }} class="absolute w-full h-[20vh] inset-0 bg-cover bg-center" style="background-image:url({$media.data.Media.bannerImage})">
    <div class="h-full w-full bg-gradient-to-b from-shadow/40 to-shadow/60" />
  </div>
  <div 
    class="w-full mt-16 flex flex-col space-y-4 relative z-10" 
    style="--color-variable:{hexToRgb($media.data.Media.coverImage.color) || "--color-accent"};--scroller-thumb:{hexToRgb($media.data.Media.coverImage.color) || "var(--color-accent)"}"
  >
    <div class="flex space-x-4">
      <div class="flex-none w-32 aspect-[3/4] bg-variable bg-cover bg-center" style="background-image:url({$media.data.Media.coverImage.extraLarge})" />
      <div class="mt-14 flex flex-col justify-between">
        <div class="flex flex-col">
          <h3 class="-mt-7 text-xs font-semibold text-white">
            <Tooltip placement="top" content="Media Format">
              <span class="uppercase">{textify($media.data.Media.format) || "Unknown"}</span>
            </Tooltip>
            &#183; 
            <Tooltip placement="top" content="Release Status">
              <span class="uppercase">{textify($media.data.Media.status) || "Unknown"}</span>
            </Tooltip>
          </h3>
          <h1 class="mt-3 text-lg font-medium leading-tight line-clamp-3">{$media.data.Media.title.userPreferred}</h1>
        </div>
        {#if $loggedIn}
          <div class="grid grid-cols-5 gap-2">
            <Tooltip placement="right" content={$media.data.Media.isFavorite ? "Remove from favorites" : "Add to favorites"}>
              <Button on:click={() => toggleFavorite()} icon={faHeart} class="w-full py-2 !bg-red {$media.data.Media.isFavorite ? "text-white/30" : "text-white/80"}" />
            </Tooltip>
            <Tooltip placement="right" content="Add to planning">
              <Button on:click={() => setStatus("PLANNING")} icon={faNotesMedical} class="w-full py-2" disabled={!canAddPlanning} />
            </Tooltip>
            <Tooltip placement="left" content="Add to current">
              <Button on:click={() => setStatus("CURRENT")} icon={faPlus} class="w-full py-2" disabled={!canAddCurrent} />
            </Tooltip>
            <Tooltip placement="left" content="Add to repeating">
              <Button on:click={() => setStatus("REPEATING")} icon={faRedo} class="w-full py-2" disabled={!canRepeat} />
            </Tooltip>
            <Tooltip placement="left" content="Remove from list">
              <Button type="ERROR" on:click={() => setStatus(null)} icon={faTrash} class="w-full py-2" disabled={canAddPlanning} />
            </Tooltip>
          </div>
        {/if}
      </div>
    </div>
    <div class="flex justify-evenly text-sm border-b border-b-variable">
      <button 
        class="px-2 pt-1 border-b-4 transition-colors rounded-t-md hover:bg-variable/10 {subView === GeneralView ? "border-b-variable" : "border-b-transparent"}" 
        on:click={() => subView = GeneralView}
      >General</button>
      <button 
        class="px-2 pt-1 border-b-4 transition-colors rounded-t-md hover:bg-variable/10 {subView === DetailsView ? "border-b-variable" : "border-b-transparent"}" 
        on:click={() => subView = DetailsView}
      >Details</button>
      <button 
        class="px-2 pt-1 border-b-4 transition-colors rounded-t-md hover:bg-variable/10 {subView === StatsView ? "border-b-variable" : "border-b-transparent"}" 
        on:click={() => subView = StatsView}
      >Stats</button>
      <button 
        class="px-2 pt-1 border-b-4 transition-colors rounded-t-md hover:bg-variable/10 {subView === SocialView ? "border-b-variable" : "border-b-transparent"}" 
        on:click={() => subView = SocialView}
      >Social</button>
      <a 
        class="px-2 pt-1 flex items-center border-b-4 transition-colors rounded-t-md hover:bg-variable/10 border-b-transparent" 
        href={$media.data.Media.siteUrl}
        target="_blank"
      >
        AniList
        <Icon class="ml-2" icon={faExternalLinkAlt} />
      </a>
    </div>
    <svelte:component this={subView} {media} {params} />
  </div>
</QueryContainer>