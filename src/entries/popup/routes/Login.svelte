<script lang="ts">
  import { tick } from "svelte";
  import Icon from "svelte-fa";
  import { faSpinner } from "@fortawesome/free-solid-svg-icons";
  import { runtime } from "webextension-polyfill";
  import { useNavigate } from "svelte-navigator";
  import { getContextClient, queryStore } from "@urql/svelte";
  import { GetCurrentlyPopularMediaDocument } from "@anilist/graphql";
  import { token, user } from "$lib/store";
  import Button from "$lib/components/Button.svelte";
  import Error from "$lib/components/Error.svelte";

  const navigate = useNavigate();
  const client = getContextClient();
  const popularMedia = queryStore({
    client,
    query: GetCurrentlyPopularMediaDocument,
  });

  let loginPromise: Promise<void> = Promise.resolve();

  function login() {
    loginPromise = runtime.sendMessage({ type: "AUTH" }).then(async (newToken: string) => {
      if (!newToken)
        throw "Login failed! Try again";

      token.set(newToken);
      await user.fetch();
      await tick();
      navigate("/medialist");
    });
  }
</script>

<div class="absolute top-0 right-0 h-1/2 w-full overflow-hidden">
  <div class="grid grid-cols-10 grid-rows-5">
    {#if $popularMedia.data?.Page.media}
      {#each $popularMedia.data.Page.media as media}
        <img src={media.coverImage.medium} alt="Key visual" class="aspect-[3/4]">
      {/each}
    {/if}
  </div>
  <div class="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-gradient-to-b from-black/60 via-black/60 to-background">
    <div class="flex items-center justify-center space-x-4">
      <Button on:click={login}>Login</Button>
      <Button on:click={() => window.open("https://anilist.co/signup", "_blank")} class="bg-purple text-white">Sign Up</Button>
    </div>
    <h2 class="w-80 text-lg font-semibold text-white text-center">Browse anonymously or login to your AniList account for the full experience!</h2>
  </div>
</div>

<div class="mt-72 pt-2 w-full flex justify-center">
  {#await loginPromise}
    <Icon icon={faSpinner} spin class="text-3xl text-accent" />
  {:catch e}
    <Error text={e} />
  {/await}
</div>