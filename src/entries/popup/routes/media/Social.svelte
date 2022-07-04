<script lang="ts">
  import { getContextClient, queryStore } from "@urql/svelte";
  import type { OperationResultStore } from "@urql/svelte/dist/types/common";
  import Icon from "svelte-fa";
  import { faNoteSticky, faRedoAlt } from "@fortawesome/free-solid-svg-icons";
  import { faSmile, faFrown, faMeh } from "@fortawesome/free-regular-svg-icons";
  import { GetMediaSocialsQuery, type GetMediaSocials, type MediaResult } from "$lib/graphql";
  import QueryContainer from "$lib/components/QueryContainer.svelte";
  import Tooltip from "$lib/components/Tooltip.svelte";
  import Section from "$lib/components/Section.svelte";

  export let media: OperationResultStore<{ Media: MediaResult }>;

  const client = getContextClient();

  const followingStats = queryStore<{ Page: GetMediaSocials }>({
    client,
    query: GetMediaSocialsQuery,
    variables: {
      id: $media.data.Media.id
    }
  });
</script>

<QueryContainer query={followingStats}>
  <Section raise={false} title="Following">
    <div class="w-full flex flex-col space-y-2">
      {#each ($followingStats.data.Page.mediaList || []) as following}
        <div class="w-full h-10 flex items-center space-x-4 bg-foreground rounded-md">
          <a href={following.user.siteUrl} target="_blank" class="flex-none">
            <div class="w-10 h-full aspect-square bg-cover rounded-full" style="background-image:url({following.user.avatar.large})" />
          </a>
          <a href={following.user.siteUrl} target="_blank" class="flex-1 hover:text-accent transition-colors">
            <h2 class="font-medium text-sm">{following.user.name}</h2>
          </a>
          <span class="capitalize text-xs font-medium">{following.status.toLowerCase()}</span>
          <div class="flex-none w-16 pr-2 grid gap-x-1.5 grid-cols-3 items-center text-lg">
            {#if following.notes}
              <Tooltip placement="left">
                <div slot="content" class="max-w-xs flex flex-col">
                  <h2 class="font-medium text-sm mb-1">User Notes</h2>
                  <p>{@html following.notes.split("\n").join("<br>")}</p>
                </div>
                <Icon icon={faNoteSticky} />
              </Tooltip>
            {:else}
              <span />
            {/if}
            {#if following.score > 0}
              <Tooltip placement="top" content="{following.score}%">
                <Icon 
                  class="text-base {following.score > 70 ? "text-green" : following.score < 50 ? "text-red" : "text-yellow"}" 
                  icon={following.score > 70 ? faSmile : following.score < 50 ? faFrown : faMeh}
                />
              </Tooltip>
            {:else}
              <span />
            {/if}
            {#if following.repeat > 0}
              <Tooltip placement="left" content="{following.repeat} Repeat(s)">
                <Icon icon={faRedoAlt} />
              </Tooltip>
            {:else}
              <span />
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </Section>
</QueryContainer>