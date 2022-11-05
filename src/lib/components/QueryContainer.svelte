<script lang="ts">
  import type { OperationResultStore, Pausable } from "@urql/svelte/dist/types/common";
  import Error from "./Error.svelte";
  import Loader from "./Loader.svelte";

  export let query: OperationResultStore & Pausable;
</script>

{#if $query.fetching || query.isPaused$ && !$query.data}
  <div class="w-full h-screen">
    <Loader />
  </div>
{:else if $query.error}
  <div class="w-full h-screen">
    <Error text={$query.error.message} />
  </div>
{:else}
  <slot/>
{/if}