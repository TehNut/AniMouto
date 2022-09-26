<script lang="ts">
  import Tooltip from "$lib/components/Tooltip.svelte";

  export let title: string;
  export let data: string = "";
  export let description: string = "";
  let containerClass: string = "";
  export { containerClass as class };
</script>

{#if description}
  <Tooltip placement="top" class="{containerClass}">
    <slot slot="content" name="description">{description}</slot>
    <div class="flex flex-col justify-between text-center text-sm bg-foreground rounded-md overflow-hidden">
      <span class="py-1"><slot><span class="line-clamp-1">{data}</span></slot></span>
      <span class="py-1 bg-foreground-grey-100 text-xs font-semibold">{title}</span>
    </div>
  </Tooltip>
{:else}
  <div class="flex flex-col justify-between text-center text-sm bg-foreground rounded-md overflow-hidden {containerClass}">
    <span class="py-1"><slot><span class="line-clamp-1">{data}</span></slot></span>
    <span class="py-1 bg-foreground-grey-100 text-xs font-semibold">{title}</span>
  </div>
{/if}