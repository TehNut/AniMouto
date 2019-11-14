<template>
  <div v-if="results.length > 0">
    <h1 class="section-title">{{ title }}</h1>
    <div class="section pad-me-daddy">
      <SearchResults v-for="(result, index) in results" v-if="index <= getDisplayIncrement() * displayMultiplier" :result="result" :key="result.id" />
      <div class="highlight-hover show-more" v-if="displayMultiplier * getDisplayIncrement() < results.length && getNextJump() > 0" @click="displayMultiplier++">
        Show {{ getNextJump() }} more
      </div>
      <div class="highlight-hover show-more" v-else-if="results.length > getDisplayIncrement()" @click="displayMultiplier = 1">
        Wait no go back ＼(º □ º l|l)/
      </div>
    </div>
  </div>
</template>

<script>
  import SearchResults from "./SearchResult";

  export default {
    name: "SearchSection",
    components: {SearchResults},
    data() {
      return {
        displayMultiplier: 1
      }
    },
    props: [
      "title",
      "results"
    ],
    methods: {
      getDisplayIncrement() {
        return 10;
      },
      getNextJump() {
        return Math.min(this.getDisplayIncrement(), this.results.length - 1 - this.displayMultiplier * this.getDisplayIncrement());
      }
    },
    watch: {
      results: {
        immediate: true,
        handler(val, oldVal) {
          if (!val || !oldVal || val.length !== oldVal.length)
            this.displayMultiplier = 1;
        }
      }
    }
  }
</script>

<style scoped>
  .pad-me-daddy {
    margin-bottom: 20px;
  }

  .show-more {
    cursor: pointer;
    text-align: center;
    margin-top: 10px;
  }
</style>
