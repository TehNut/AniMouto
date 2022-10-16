<script lang="ts">
  import type { OperationResultStore } from "@urql/svelte/dist/types/common";
  import Icon from "svelte-fa";
  import { faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
  import { type GetMediaByIdQuery, type MediaRank, MediaListStatus, MediaRankType } from "@anilist/graphql";
  import Button from "$lib/components/Button.svelte";
  import Section from "$lib/components/Section.svelte";

  export let media: OperationResultStore<GetMediaByIdQuery>;

  $: totalStatuses = $media.data?.Media.stats.statusDistribution.reduce((total, status) => total + status.amount, 0);
  $: highestRating = $media.data?.Media.stats.scoreDistribution.reduce((highest, score) => Math.max(highest, score.amount), 0);

  function getStatusColor(status: MediaListStatus) {
    switch (status) {
      case MediaListStatus.CURRENT: return "var(--color-green)";
      case MediaListStatus.PLANNING: return "var(--color-blue)";
      case MediaListStatus.COMPLETED: return "var(--color-purple)";
      case MediaListStatus.DROPPED: return "var(--color-peach)";
      case MediaListStatus.PAUSED: return "var(--color-orange)";
    }
  }

  function getRankBrowse(rank: Partial<MediaRank>): string {
    const params = new URLSearchParams({
      sort: (rank.type === MediaRankType.RATED ? "SCORE" : "POPULARITY") + "_DESC",
      format: rank.format
    });
    if (!rank.allTime) {
      if (rank.season)
        params.append("season", rank.season);

      if (rank.year)
        params.append("year", rank.year.toString());
    }

    return `https://anilist.co/search/${$media.data.Media.type.toLowerCase()}?` + params.toString();
  }
</script>

<div class="flex flex-col space-y-2">
  {#if $media.data.Media.rankings.length > 0}
    <Section title="Rankings" raise={false}>
      <div class="grid grid-cols-2 gap-2">
        {#each $media.data.Media.rankings as rank}
          <a href={getRankBrowse(rank)} target="_blank">
            <div class="h-8 flex items-center bg-foreground rounded-md">
              <Icon class="flex-0 aspect-square w-6 mr-1 {rank.type === MediaRankType.POPULAR ? "text-peach" : "text-yellow"}" icon={rank.type === MediaRankType.POPULAR ? faHeart : faStar } />
              <span class="capitalize text-xs font-semibold leading-none">#{rank.rank} {rank.context} {rank.allTime ? "" : `${rank.season ? rank.season.toLowerCase() + " " : ""} ${rank.year}`}</span>
            </div>
          </a>
        {/each}
      </div>
    </Section>
  {/if}
  <Section title="Status Distribution">
    <div class="grid grid-cols-5 gap-2">
      {#each $media.data.Media.stats.statusDistribution as status}
        <div class="flex flex-col text-center" style="--color-variable:{getStatusColor(status.status)}">
          <Button class="px-1 py-0.5 text-sm capitalize cursor-default" type="VARIABLE">{status.status.toLowerCase()}</Button>
          <span class="font-medium text-variable">{status.amount.toLocaleString()}</span>
        </div>
      {/each}
    </div>
    <div class="absolute h-2 left-0 right-0 bottom-0 flex rounded-bl-md rounded-br-md overflow-hidden">
      {#each $media.data.Media.stats.statusDistribution as status}
        <div style="width:{status.amount / totalStatuses * 100}%;--color-variable:{getStatusColor(status.status)}" class="bg-variable h-full" />
      {/each}
    </div>
  </Section>
  <Section title="Score Distribution">
    <div class="group h-24 py-2 grid grid-cols-10 gap-2">
      {#each new Array(10) as _, index}
        {@const score = $media.data.Media.stats.scoreDistribution.find(s => s.score === (index + 1) * 10) || { amount: 0, score: (index + 1) * 10 }}
        {@const percentage = score.amount / highestRating * 100}
        <div class="relative w-full flex flex-col-reverse items-center text-center text-sm font-medium" style="--color-variable:hsl({score.score}, 65%, 50%)">
          <span class="absolute -bottom-5 text-variable-hex">{ score.score }</span>
          <div style="height:{percentage}%;" class="w-4 min-h-[1rem] rounded-full bg-variable-hex" />
          <span class="absolute opacity-0 group-hover:opacity-100 transition-opacity text-xs" style="bottom:max(1rem, {percentage}%)">{ score.amount.toLocaleString() }</span>
        </div>
      {/each}
    </div>
  </Section>
</div>