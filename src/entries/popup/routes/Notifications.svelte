<script lang="ts">
  import { tick } from "svelte";
  import Icon from "svelte-fa";
  import { faRedo } from "@fortawesome/free-solid-svg-icons";
  import NotificationPage from "$lib/components/notifications/NotificationPage.svelte";
  import Section from "$lib/components/Section.svelte";
  import Tooltip from "$lib/components/Tooltip.svelte";
  import Button from "$lib/components/Button.svelte";

  let pages: number[] = [0];
  let lastPage = false;

  async function reset() {
    pages = [];
    await tick();
    lastPage = false;
    pages = [0];
  }

  function loadMore() {
    pages = [...pages, pages.length];
  }
</script>

<div class="absolute top-3 right-3 flex space-x-2 text-text-200">
  <Tooltip content="Refresh" placement="left">
    <button class="hover:text-accent transition-colors" on:click={reset}>
      <Icon icon={faRedo} />
    </button>
  </Tooltip>
</div>
<Section raise={false}>
  <div slot="title" class="items-center font-semibold">
    <a href="https://anilist.co/notifications" target="_blank">Notifications</a>
  </div>
  <div class="flex flex-col space-y-2">
    {#each pages as _, page}
      <NotificationPage page={page + 1} on:last-page={() => lastPage = true} />
    {/each}
    {#if !lastPage}
      <Button type="INFO" on:click={loadMore}>Load More</Button>
    {/if}
  </div>
</Section>