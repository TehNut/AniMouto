<template>
  <a :href="entry.media.siteUrl" target="_blank">
    <div class="cover" ref="cover" @mouseenter="displayProgress = true" @mouseleave="displayProgress = false">
      <transition name="fade">
        <div v-if="!displayProgress && entry.media.nextAiringEpisode" class="cover-overlay">
          <span class="overlay-text">
            Ep {{ entry.media.nextAiringEpisode.episode }}
            <br/>
            {{ timeUntilAiring() }}
          </span>
        </div>
      </transition>
      <transition name="fade">
        <div v-if="displayProgress" class="cover-overlay">
          <span class="overlay-text progress-text" @click.prevent="handleProgressClick">{{ entry.progress }} +</span>
        </div>
      </transition>
      <div v-if="entry.media.nextAiringEpisode && entry.media.nextAiringEpisode.episode - 1 > entry.progress" class="is-behind"></div>
    </div>
  </a>
</template>

<script>
  import {formatTime, queryAL} from "../../../assets/js/utils";
  import updateProgressQuery from "../../../assets/graphql/update_progress.graphql"

  export default {
    name: "MediaCard",
    data() {
      return {
        displayProgress: false
      }
    },
    props: [
      "entry"
    ],
    mounted() {
      this.$refs.cover.style.backgroundImage = `url(${this.entry.media.coverImage.large})`;
      this.$refs.cover.style.backgroundColor = this.entry.media.coverImage.color;
    },
    methods: {
      timeUntilAiring() {
        return formatTime(this.entry.media.nextAiringEpisode.timeUntilAiring)
      },
      handleProgressClick() {
        const _self = this;

        let completionDate = null;
        if (this.entry.progress + 1 >= this.entry.media.episodes && this.entry.progress + 1 >= this.entry.media.chapters) {
          let currentDate = new Date(Date.now());
          completionDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
        }

        chrome.storage.local.get({ access_token: "" }, value => {
          if (value.access_token === "")
            return;

          queryAL(updateProgressQuery, { listId: this.entry.id, progress: this.entry.progress + 1, completionDate: completionDate }, value.access_token)
            .then(() => _self.entry.progress++);
        });
      }
    }
  }
</script>

<style scoped>
  .cover {
    height: 115px;
    max-height: 115px;
    width: 85px;
    background-size: cover;
    background-position: center;
    border-radius: 3px;
    position: relative;
    transition: .2s;
  }

  .cover-overlay {
    background-color: rgba(var(--color-overlay), .7);
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 0;
    transition: .1s;
  }

  .overlay-text {
    color: rgba(var(--color-text-bright), .9);
    padding: 8px;
    display: inline-block;
    position: relative;
  }

  .progress-text {
    transition: .1s;
  }

  .progress-text:hover {
    font-weight: bold;
  }

  .is-behind {
    position: absolute;
    background-color: rgb(var(--color-red));
    height: 4px;
    width: 100%;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    bottom: 0;
  }
</style>
