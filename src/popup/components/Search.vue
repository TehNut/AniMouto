<template>
  <div>
    <div class="search-container">
      <input type="text" class="text-input" ref="searchBar" placeholder="Search for Anime and Manga..." autocomplete="off" />
    </div>
    <div class="spacer" style="margin-top:10px;margin-bottom:10px;"></div>
    <transition name="fade">
      <div id="blank-marker"><i class="material-icons no-select" style="font-size:200px;position:relative;">search</i></div>
    </transition>
    <div ref="results">
      <div id="anime-results" class="section pad-me-daddy" style="display:none"></div>
      <div id="manga-results" class="section pad-me-daddy" style="display:none"></div>
    </div>
  </div>
</template>

<script>
  import Spinner from "./base/Spinner";
  export default {
    name: "Search",
    components: {Spinner},
    data() {
      return {
        results: []
      }
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
    margin-left: auto;
    margin-right: auto;
    margin-top: 100px;
    text-align: center;
  }

  .pad-me-daddy {
    margin-bottom: 20px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
