<script type="ts">
  import { getContextClient, mutationStore } from "@urql/svelte";
  import { Link } from "svelte-navigator";
  import Icon from "svelte-fa";
  import { faNotesMedical, faPlus, faRedo } from "@fortawesome/free-solid-svg-icons";
  import { SetMediaListStatusDocument, MediaListStatus, type SearchResultMediaFragment } from "@anilist/graphql";
  import { loggedIn } from "$lib/store";
  import { hexToRgb } from "$lib/util";
  import Tooltip from "./Tooltip.svelte";
  import Section from "./Section.svelte";
  import anilistLogo from "$assets/anilist.svg";

  const client = getContextClient();

  export let title: string;
  export let results: SearchResultMediaFragment[];

  function setStatus(media: SearchResultMediaFragment, status: MediaListStatus) {
    mutationStore({
      client,
      query: SetMediaListStatusDocument,
      variables: {
        media: media.id,
        list: media.mediaListEntry?.id || undefined,
        status,
        delete: false
      }
    });
  }

  function canAddPlanning(media: SearchResultMediaFragment): boolean {
    return media.mediaListEntry === null;
  }

  function canAddCurrent(media: SearchResultMediaFragment): boolean {
    if (media.status === "NOT_YET_RELEASED")
      return false;
      
    if (!media.mediaListEntry)
      return true;
    
    const status = media.mediaListEntry.status;
    return ![ "CURRENT", "COMPLETED", "REPEATING" ].includes(status);
  }

  function canRewatch(media: SearchResultMediaFragment): boolean {
    return media.mediaListEntry?.status === "COMPLETED";
  }
</script>

{#if results?.length > 0}
  <Section raise={false} {title}>
    <div class="flex flex-col space-y-4">
      {#each results as media}
        <div class="w-full h-16 flex items-center space-x-2 bg-foreground rounded-md">
          <Link to="/media/{media.id}">
            <div class="w-12 h-full flex-none aspect-[3/4] bg-cover rounded-l-md" style="background-image:url({media.coverImage.medium})" />
          </Link>
          <Link to="/media/{media.id}" class="flex-1 hover:text-variable transition-colors" style="--color-variable:{hexToRgb(media.coverImage.color)}">
            <h2 class="line-clamp-2 font-medium text-sm">{media.title.userPreferred}</h2>
          </Link>
          {#if $loggedIn}
            <div class="flex-none w-1/6 grid gap-x-1.5 grid-cols-3 items-center text-lg">
              <Tooltip content="View on AniList" placement="top">
                <a href={media.siteUrl} target="blank">
                  <img class="aspect-square bg-overlay rounded-md" src={anilistLogo} alt="AniList Logo">
                </a>
              </Tooltip>
              {#if canAddPlanning(media)}
                <Tooltip class="h-min flex items-center" content="Add to planning" placement="top">
                  <button on:click={() => setStatus(media, MediaListStatus.PLANNING)}>
                    <Icon class="aspect-square text-lg" icon={faNotesMedical} />
                  </button>
                </Tooltip>
              {/if}
              {#if canAddCurrent(media)}
                <Tooltip class="h-min flex items-center" content="Add to current" placement="top">
                  <button on:click={() => setStatus(media, MediaListStatus.CURRENT)}>
                    <Icon icon={faPlus} />
                  </button>
                </Tooltip>
              {/if}
              {#if canRewatch(media)}
                <Tooltip class="h-min flex items-center" content="Add to repeating" placement="top">
                  <button on:click={() => setStatus(media, MediaListStatus.REPEATING)}>
                    <Icon icon={faRedo} />
                  </button>
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