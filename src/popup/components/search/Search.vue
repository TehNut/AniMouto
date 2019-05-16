<template>
  <div>
    <div class="search-container">
      <input type="text" class="text-input" ref="searchBar" placeholder="Search for Anime and Manga..." autocomplete="off" />
    </div>
    <div class="spacer" style="margin-top:10px;margin-bottom:10px;"></div>
    <transition name="fade">
      <div class="blank-marker" v-if="results.anime.length === 0 && results.manga.length === 0 && !searching">
        <i class="material-icons no-select" style="font-size:200px;position:relative;">search</i>
      </div>
    </transition>

    <transition name="fade">
      <Spinner v-if="searching"/>
    </transition>

    <SearchSection title="Anime" :results="results.anime"/>
    <SearchSection title="Manga" :results="results.manga"/>
    <SearchSection title="Light Novels" :results="results.novels"/>
  </div>
</template>

<script>
  import Spinner from "../base/Spinner";
  import {queryAL} from "../../../assets/js/utils";
  import SearchResult from "./SearchResult";
  import mediaSearchQuery from "../../../assets/graphql/media_search.graphql";
  import SearchSection from "./SearchSection";

  export default {
    name: "Search",
    components: {SearchSection, SearchResult, Spinner},
    data() {
      return {
        searching: false,
        results: {
          anime: [],
          manga: [],
          novels: []
        }
      }
    },
    mounted() {
      let timeout = null;
      let lastSearch = null;

      const _self = this;

      this.$refs.searchBar.focus();
      this.$refs.searchBar.addEventListener("keyup", e => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          const trimmed = this.$refs.searchBar.value.trim();
          if (trimmed === "" || trimmed === lastSearch)
            return;

          _self.results.anime = [];
          _self.results.manga = [];
          _self.results.novels = [];
          _self.searching = true;

          lastSearch = trimmed;
          this.$browser.storage.local.get({access_token: ""}).then(value => {
            queryAL(mediaSearchQuery, { search: trimmed }, value.access_token).then(res => {
              res.data.Page.media.forEach(e => {
                _self.searching = false;

                switch (e.format) {
                  case "MANGA":
                  case "ONE_SHOT": _self.results.manga.push(e); break;
                  case "NOVEL": _self.results.novels.push(e); break;
                  case "MOVIE":
                  case "MUSIC":
                  case "ONA":
                  case "OVA":
                  case "SPECIAL":
                  case "TV":
                  case "TV_SHORT": _self.results.anime.push(e); break;
                }
              })
            });
          });
        }, 700)
      });
    },
    activated() {
      this.$refs.searchBar.focus();
    }
  }
</script>

<style scoped>
  .search-container {
    background: rgb(var(--color-foreground));
    display: flex;
    margin-left: auto;
    margin-right: auto;
    width: 70%;
    height: 35px;
    border-radius: 4px;
  }

  .blank-marker {
    color: rgba(var(--color-text-lighter), 0.8);
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    margin-top: 100px;
    text-align: center;
    position: absolute;

  }
</style>
