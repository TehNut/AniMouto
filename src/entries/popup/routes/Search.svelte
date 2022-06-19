<script lang="ts" context="module">
  type SearchMode = "ALL" | "ANIME" | "MANGA" | "LIGHT_NOVEL";
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "svelte-fa";
  import { faSpinner } from "@fortawesome/free-solid-svg-icons";
  import { operationStore, query } from "@urql/svelte";
  import type { SearchResult } from "$lib/graphql";
  import { SearchQuery, } from "$lib/graphql";
  import SearchResults from "$lib/components/SearchResults.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import Error from "$lib/components/Error.svelte";

  const search = operationStore<{ Page: SearchResult }>(SearchQuery, undefined, {
    pause: true
  });
  query(search);

  let selectedMode: SearchMode = "ALL";
  let lastSearch = "";
  let searchText = "";
  let debouncer = null;
  let textField: HTMLInputElement = null;

  onMount(() => textField?.focus());

  function changeSearchMode(mode: SearchMode) {
    selectedMode = mode;
    submitSearch();
  }

  function debounce() {
    clearTimeout(debouncer);
    debouncer = setTimeout(() => {
      if (searchText !== lastSearch) {
        submitSearch()
        lastSearch = searchText;
      }
    }, 700);
  }

  function submitSearch() {
    if (searchText.length === 0)
      return;

    $search.context.pause = false;
    $search.variables = {
      search: searchText,
      type: selectedMode === "ALL" ? undefined : selectedMode === "ANIME" ? "ANIME" : "MANGA",
      format: selectedMode === "ALL" ? undefined : selectedMode === "MANGA" ? [ "MANGA", "ONE_SHOT" ] : selectedMode === "LIGHT_NOVEL" ? [ "NOVEL" ] : undefined,
    }
    $search.reexecute();
  }
</script>

<div class="w-full h-full flex flex-col items-center">
  <div class="relative w-2/3">
    <input 
      type="text" 
      placeholder="Search AniList..." 
      class="w-full p-2 mt-4 rounded-md text-md bg-foreground focus:outline-none focus:ring-2 ring-accent"
      bind:this={textField}
      bind:value={searchText}
      on:keyup={() => debounce()}
    />
    {#if $search.fetching}
      <Icon class="absolute right-2 bottom-3 pointer-events-none text-accent" icon={faSpinner} spin />
    {/if}
  </div>
  <div class="w-2/3 mt-4 grid grid-cols-4 border border-text-300 rounded-md">
    <button 
      class="px-2 py-0.5 text-sm rounded-md hover:bg-accent/40 hover:text-text-400 transition-colors" 
      class:selected={selectedMode === "ALL"}
      on:click={() => changeSearchMode("ALL")}
    >All</button>
    <button 
      class="px-2 py-0.5 text-sm rounded-md hover:bg-accent/40 hover:text-text-400 transition-colors" 
      class:selected={selectedMode === "ANIME"}
      on:click={() => changeSearchMode("ANIME")}
    >Anime</button>
    <button
      class="px-2 py-0.5 text-sm rounded-md hover:bg-accent/40 hover:text-text-400 transition-colors" 
      class:selected={selectedMode === "MANGA"}
      on:click={() => changeSearchMode("MANGA")}
    >Manga</button>
    <button
      class="px-2 py-0.5 text-sm rounded-md hover:bg-accent/40 hover:text-text-400 transition-colors" 
      class:selected={selectedMode === "LIGHT_NOVEL"}
      on:click={() => changeSearchMode("LIGHT_NOVEL")}
    >Novel</button>
  </div>
  {#if $search.fetching}
    <Loader />
  {:else if $search.error}
    <Error text={$search.error.message} />
  {:else if $search.data}
    <div class="w-full mt-6 flex flex-col space-y-4">
      {#if !$search.data.Page.media?.length}
        <Error warning text="No results found!" />
      {:else}
        <SearchResults 
          title="Anime" 
          results={$search.data.Page.media.filter(m => m.type === "ANIME")} 
        />
        <SearchResults 
          title="Manga" 
          results={$search.data.Page.media.filter(m => m.type === "MANGA" && m.format !== "NOVEL")} 
        />
        <SearchResults 
          title="Light Novels" 
          results={$search.data.Page.media.filter(m => m.format === "NOVEL")} 
        />
      {/if}
    </div>
  {/if}

</div>

<style scoped>
  .selected {
    @apply bg-accent hover:bg-accent text-white;
  }
</style>