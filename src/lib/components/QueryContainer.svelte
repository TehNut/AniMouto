<script lang="ts">
  import type { OperationStore } from "@urql/svelte";
  import { query as runQuery } from "@urql/svelte";
  import Error from "./Error.svelte";
  import Loader from "./Loader.svelte";

  export let query: OperationStore;

  runQuery(query);
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