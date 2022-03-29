<script lang="ts">
  import Error from "$lib/components/Error.svelte";

  export let params: any;
</script>

<pre>
  {JSON.stringify(params, null, 2)}
</pre>

<Error warning text="Coming soon!" />