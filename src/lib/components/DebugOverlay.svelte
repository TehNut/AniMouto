<script lang="ts">
  import { extensionConfig, queryCount } from "$lib/store";

  $: debug = $extensionConfig.debug;
  $: anyVisible = debug.displayQueryLimits;
</script>

{#if anyVisible}
  <div class="sticky inset-0 h-0 pointer-events-none z-50">
    <div class="w-max p-2 rounded-md text-xs font-medium text-white bg-black/70 backdrop-blur-sm">
      {#if debug.displayQueryLimits}
        Queries: <span class={$queryCount < 30 ? "text-red" : $queryCount < 50 ? "text-orange" : "text-green"}>{$queryCount}</span>/90
      {/if}
    </div>
  </div>
{/if}