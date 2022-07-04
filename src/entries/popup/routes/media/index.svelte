<script lang="ts">
  import { fade } from "svelte/transition";
  import { useParams } from "svelte-navigator";
  import { queryStore, mutationStore, getContextClient } from "@urql/svelte";
  import Icon from "svelte-fa";
  import { faHeart, faFilePen, faNotesMedical, faPlus, faRedo, faTrash, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
  import { faHeart as faHeartOutline, faSmile, faFrown, faMeh } from "@fortawesome/free-regular-svg-icons";
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

  const params = useParams();
  const client = getContextClient();
  $: media = queryStore<{ Media: MediaResult }>({
    client,
    query: MediaQuery, 
    variables: {
      id: parseInt($params.id)
    }
  });

  $: canAddPlanning = $media.data?.Media.mediaListEntry === null;
  $: canRepeat = $media.data?.Media.mediaListEntry?.status === "COMPLETED";
  $: canAddCurrent = $media.data?.Media && $media.data?.Media.status !== "NOT_YET_RELEASED" && ![ "CURRENT", "COMPLETED", "REPEATING" ].includes($media.data?.Media.mediaListEntry?.status);

  let subView: typeof GeneralView | typeof DetailsView | typeof StatsView | typeof SocialView = GeneralView;

  function toggleFavorite() {
    mutationStore({
      client,
      query: ToggleFavoriteMutation,
      variables: { 
        [$media.data.Media.type.toLowerCase()]: $media.data.Media.id 
      }
    });
  }

  function setStatus(status?: MediaResult["mediaListEntry"]["status"]) {
    mutationStore({
      client,
      query: ChangeStatusMutation,
      variables: { 
        media: $media.data.Media.id,
        list: $media.data.Media.mediaListEntry?.id,
        status,
        delete: !status
      }
    });
  }
</script>

<QueryContainer query={media}>
  <div 
    in:fade={{ duration: 1, delay: 150 }} 
    class="absolute w-full {$media.data.Media.bannerImage ? "h-[20vh]" : "h-[24vh] -mt-[4vh]"} inset-0 bg-cover bg-center" 
    style="background-image:url({$media.data.Media.bannerImage || $media.data.Media.coverImage.extraLarge})"
  >
    <div class="h-full w-full bg-gradient-to-b from-shadow/40 to-shadow/60 {!$media.data.Media.bannerImage ? "backdrop-blur-sm" : ""}" />
  </div>
  <div 
    class="w-full mt-16 flex flex-col space-y-4 relative z-10" 
    style="--color-variable:{hexToRgb($media.data.Media.coverImage.color) || "--color-accent"};--scroller-thumb:{hexToRgb($media.data.Media.coverImage.color) || "var(--color-accent)"}"
  >
    <div class="flex space-x-4">
      <div class="flex-none w-32 aspect-[3/4] bg-variable bg-cover bg-center" style="background-image:url({$media.data.Media.coverImage.large})" />
      <div class="mt-14 flex flex-col justify-between">
        <div class="flex flex-col">
          <h3 class="flex items-center space-x-2 -mt-7 text-xs font-semibold text-white">
            <Tooltip placement="top" content="Media Format">
              <span class="uppercase">{textify($media.data.Media.format) || "Unknown"}</span>
            </Tooltip>
            <span>&#183;</span> 
            <Tooltip placement="top" content="Release Status">
              <span class="uppercase">{textify($media.data.Media.status) || "Unknown"}</span>
            </Tooltip>
            {#if $media.data.Media.averageScore}
              <span>&#183;</span> 
              <Tooltip placement="top" content="{$media.data.Media.averageScore}% Average Rating">
                <Icon 
                  class="text-sm {$media.data.Media.averageScore > 70 ? "text-green" : $media.data.Media.averageScore < 50 ? "text-red" : "text-yellow"}" 
                  icon={$media.data.Media.averageScore > 70 ? faSmile : $media.data.Media.averageScore < 50 ? faFrown : faMeh}
                />
              </Tooltip>
            {/if}
            <div class="flex-1 flex justify-end text-sm">
              {#if $loggedIn}
                <Tooltip class="w-max" placement="top" content={$media.data.Media.isFavorite ? "Remove from favorites" : "Add to favorites"}>
                  <button on:click={() => toggleFavorite()}>
                    <Icon class="text-red" icon={$media.data.Media.isFavorite ? faHeart : faHeartOutline} />
                  </button>
                </Tooltip>
              {/if}
            </div>
          </h3>
          <h1 class="mt-3 text-lg font-medium leading-tight line-clamp-3">{$media.data.Media.title.userPreferred}</h1>
        </div>
        {#if $loggedIn}
          <div class="grid grid-cols-5 gap-2">
            <Tooltip placement="right" content="Open editor (Not yet implemented)">
              <Button icon={faFilePen} class="w-full py-2" disabled={true} />
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
      {#if $loggedIn}
        <button 
          class="px-2 pt-1 border-b-4 transition-colors rounded-t-md hover:bg-variable/10 {subView === SocialView ? "border-b-variable" : "border-b-transparent"}" 
          on:click={() => subView = SocialView}
        >Following</button>
      {/if}
      <a 
        class="px-2 pt-1 flex items-center border-b-4 transition-colors rounded-t-md hover:bg-variable/10 border-b-transparent" 
        href={$media.data.Media.siteUrl}
        target="_blank"
      >
        AniList
        <Icon class="ml-2" icon={faExternalLinkAlt} />
      </a>
    </div>
    <svelte:component this={subView} {media} />
  </div>
</QueryContainer>