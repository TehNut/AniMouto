<script lang="ts">
  import { Link } from "svelte-navigator";
  import Lazy from "svelte-lazy";
  import type { Media, MediaTitle, MediaCoverImage } from "@anilist/graphql";
  import { textify, hexToRgb } from "$lib/util";
  import Tooltip from "./Tooltip.svelte";

  export let media: Partial<Pick<Media, "id" | "format" | "status"> & {
    title: Pick<MediaTitle, "userPreferred">,
    coverImage: Pick<MediaCoverImage, "color" | "large">,
  }>
</script>

<Tooltip placement="right">
  <div slot="content" class="flex flex-col w-48">
    <h2 class="font-semibold text-sm mb-2 leading-tight">{media.title.userPreferred}</h2>
    <slot name="tooltip-body">
      <span>{textify(media.format) || "Unknown"} &#183; {textify(media.status) || "Unknown"}</span>
    </slot>
  </div>
  <Link 
    to="/media/{media.id}"
    class="flex flex-col group outline-none focus:ring-2 ring-black rounded-md" 
    style="--color-variable:{hexToRgb(media.coverImage.color) || "var(--color-accent)"}" 
  >
    <div class="relative aspect-[3/4] bg-variable rounded-md overflow-hidden">
      <Lazy fadeOption={{ duration: 200 }} class="!h-full">
        <img class="h-full aspect-[3/4] object-cover object-center" src="{media.coverImage.large}" alt="Key visual">
      </Lazy>
      <slot />
    </div>
  </Link>
</Tooltip>

<style scoped>
  :global(.svelte-lazy-content) {
    @apply h-full;
  }
</style>