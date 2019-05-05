<template>
  <transition name="fade">
    <div v-if="list.length > 0">
      <h1 class="section-title">
        <a v-if="title.url" :href="title.url" target="_blank">{{ title.text }}</a>
        <span v-else>{{ title.text || title }}</span>
      </h1>
      <transition-group name="fade" tag="div" class="section media-grid">
        <MediaCard v-for="(entry, index) in list" v-if="!isComplete(entry)" :entry="entry" :left="index % 4 >= 2" :key="entry.media.id">
          <span class="progress">
            Progress: {{ entry.progress }}<span v-if="getTotalCount(entry.media) > 0">/{{ getTotalCount(entry.media) }}</span>
          </span>
          <span v-if="entry.media.nextAiringEpisode && entry.media.nextAiringEpisode.episode - 1 > entry.progress" class="behind">
            {{ getEpisodesBehind(entry) }}
          </span>
        </MediaCard>
      </transition-group>
    </div>
  </transition>
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
      getEpisodesBehind(entry) {
        const behind = entry.media.nextAiringEpisode.episode - 1 - entry.progress;
        return `${behind} episode${behind > 1 ? 's' : ''} behind`;
      },
      getTotalCount(media) {
        if (media.episodes)
          return media.episodes;
        else if (media.chapters)
          return media.chapters;

        return -1;
      }
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
    justify-content: center;
  }

  .progress {
    font-size: small;
    color: rgb(var(--color-text));
  }

  .behind {
    color: rgb(var(--color-red));
    position: absolute;
    left: 10px;
    bottom: 10px;
  }
</style>
