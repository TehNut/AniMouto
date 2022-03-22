<script lang="ts">
  import { link } from "svelte-spa-router";
  import Lazy from "svelte-lazy";
  import { textify, hexToRgb } from "$lib/util";
  import Tooltip from "./Tooltip.svelte";

  export let media: {
    id: number
    format: string
    status: string
    title: {
      userPreferred: string
    }
    coverImage: {
      color: string
      extraLarge: string
    }
  };
</script>
<Tooltip placement="right">
  <div slot="content" class="flex flex-col w-48">
    <h2 class="font-semibold text-sm mb-2 leading-tight">{media.title.userPreferred}</h2>
    <span>
      {textify(media.format)} &#183; {textify(media.status)}
    </span>
  </div>
  <a class="flex flex-col group" style="--color-variable:{hexToRgb(media.coverImage.color) || "var(--color-accent)"}" href="#/media/{media.id}" use:link>
    <div class="relative aspect-[3/4] bg-variable rounded-md overflow-hidden">
      <Lazy fadeOption={{ duration: 200 }}>
        <img class="h-full aspect-[3/4] object-cover object-center" src="{media.coverImage.extraLarge}" alt="Key visual">
      </Lazy>
      <slot />
    </div>
  </a>
</Tooltip>