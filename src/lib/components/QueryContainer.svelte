<script lang="ts">
  import type { OperationResultStore } from "@urql/svelte/dist/types/common";
  import Error from "./Error.svelte";
  import Loader from "./Loader.svelte";

  export let query: OperationResultStore;
</script>

{#if $query.fetching}
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