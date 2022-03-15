<script lang="ts">
  import { runtime } from "webextension-polyfill";
  import { push } from "svelte-spa-router";
  import { token, user } from "$lib/store";

  let loginPromise: Promise<void> = Promise.resolve();

  function login() {
    loginPromise = runtime.sendMessage({ type: "AUTH" }).then(async (newToken: string) => {
      token.set(newToken);
      await user.fetch();
      push("/medialist");
    });
  }
</script>

<button on:click={() => login()}>
  Login
</button>

{#await loginPromise}
  Logging in
{:then}
  {$user.name}
{/await}

<!-- <div class="absolute inset-0 h-48 grid grid-cols-12 grid-rows-2"> -->
  <!-- Elements should span 2 columns and -->
<!-- </div> -->

<!-- <div class="absolute inset-0 h-48 bg-gradient-to-b from-shadow/40 to-shadow/80" /> -->