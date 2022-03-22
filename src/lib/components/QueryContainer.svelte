<script lang="ts">
  import type { OperationStore } from "@urql/svelte";
  import { query as runQuery } from "@urql/svelte";
  import Error from "./Error.svelte";
  import Loader from "./Loader.svelte";

  export let query: OperationStore;

  runQuery(query);
</script>

{#if $query.fetching}
  <Loader />
{:else if $query.error}
  <Error text={$query.error.message} />
{:else}
  <slot/>
{/if}