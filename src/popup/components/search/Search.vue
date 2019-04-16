<template>
  <div>
    <div class="search-container">
      <input type="text" class="text-input" ref="searchBar" placeholder="Search for Anime and Manga..." autocomplete="off" />
    </div>
    <div class="spacer" style="margin-top:10px;margin-bottom:10px;"></div>
    <transition name="fade">
      <div id="blank-marker" v-if="results.anime.length === 0 && results.manga.length === 0 && !searching">
        <i class="material-icons no-select" style="font-size:200px;position:relative;">search</i>
      </div>
    </transition>

    <transition name="fade">
      <Spinner v-if="searching"/>
    </transition>

    <div class="results">
      <h1 class="section-title" v-if="results.anime.length > 0">Anime</h1>
      <div class="section pad-me-daddy" v-if="results.anime.length > 0">
        <SearchResult v-for="result in results.anime" :result="result" />
      </div>

      <h1 class="section-title" v-if="results.manga.length > 0">Manga</h1>
      <div class="section pad-me-daddy" v-if="results.manga.length > 0">
        <SearchResult v-for="result in results.manga" :result="result" />
      </div>
    </div>
  </div>
</template>

<script>
  import Spinner from "../base/Spinner";
  import {queryAL, getQuery} from "../../../assets/js/utils";
  import SearchResult from "./SearchResult";
  import mediaSearchQuery from "../../../assets/graphql/media_search.graphql";

  export default {
    name: "Search",
    components: {SearchResult, Spinner},
    data() {
      return {
        searching: false,
        results: {
          anime: [],
          manga: []
        }
      }
    },
    mounted() {
      let timeout = null;
      let lastSearch = null;

      const _self = this;
      this.$refs.searchBar.addEventListener("keyup", e => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          const trimmed = this.$refs.searchBar.value.trim();
          if (trimmed === "" || trimmed === lastSearch)
            return;

          _self.results.anime = [];
          _self.results.manga = [];
          _self.searching = true;

          lastSearch = trimmed;
          chrome.storage.local.get({access_token: ""}, value => {
            queryAL(mediaSearchQuery, { search: trimmed }, value.access_token).then(res => {
              res.data.Page.media.forEach(e => {
                _self.searching = false;

                if (e.format !== "MANGA" && e.format !== "NOVEL" && e.format !== "ONE_SHOT")
                  _self.results.anime.push(e);
                else
                  _self.results.manga.push(e);
              })
            });
          });
        }, 700)
      });
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

  #blank-marker {
    color: rgba(var(--color-text-lighter), 0.8);
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    margin-top: 100px;
    text-align: center;
    position: absolute;

  }

  .pad-me-daddy {
    margin-bottom: 20px;
  }

  .results {

  }
</style>
