<script lang="ts">
  import { runtime } from "webextension-polyfill";
  import { useNavigate } from "svelte-navigator";
  import { token, user } from "$lib/store";

  const navigate = useNavigate();

  let loginPromise: Promise<void> = Promise.resolve();

  function login() {
    loginPromise = runtime.sendMessage({ type: "AUTH" }).then(async (newToken: string) => {
      token.set(newToken);
      await user.fetch();
      navigate("/medialist");
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