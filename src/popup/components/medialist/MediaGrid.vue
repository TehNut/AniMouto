<template>
  <div v-if="list.length > 0">
      <h1 class="section-title">
        <a v-if="title.url" :href="title.url" target="_blank">{{ title.text }}</a>
        <span v-else>{{ title.text || title }}</span>
      </h1>
      <div class="section media-grid">
        <MediaCard v-for="(entry, index) in list" v-if="!isComplete(entry)" :entry="entry" :left="index % 4 >= 2"/>
      </div>
    </div>
</template>

<script>
  import MediaCard from "./MediaCard";
  export default {
    name: "MediaGrid",
    components: {MediaCard},
    props: [
      "list",
      "title"
    ],
    methods: {
      isComplete(entry) {
        return (entry.media.episodes && entry.progress >= entry.media.episodes) || (entry.media.chapters && entry.progress >= entry.media.chapters);
      },
    }
  }
</script>

<style scoped>
  .media-grid {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fill, 85px);
    grid-template-rows: repeat(auto-fill, 115px);
    margin-bottom: 25px;
  }
</style>
