<template>
  <a :href="mediaInternal.siteUrl" target="_blank">
    <div class="cover" ref="cover" @mouseenter="displayExtras = true" @mouseleave="displayExtras = false">
      <transition name="fade">
        <div v-if="!displayExtras && mediaInternal.nextAiringEpisode" class="cover-overlay">
          <span class="overlay-text">
            Ep {{ mediaInternal.nextAiringEpisode.episode }}
            <br/>
            {{ timeUntilAiring() }}
          </span>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="!entry && displayExtras" class="cover-overlay">
          <i class="material-icons overlay-text details-icon" @click.prevent="$router.push({ name: 'media-view', params: { id: mediaInternal.id } })">forward</i>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="entry && displayExtras" class="cover-overlay">
          <span class="overlay-text progress-text" @click.prevent="handleProgressClick">{{ entry.progress }} +</span>
          <i class="material-icons overlay-text details-icon entry" @click.prevent="$router.push({ name: 'media-view', params: { id: mediaInternal.id } })">forward</i>
        </div>
      </transition>

      <transition name="fade">
        <MediaCardPopout v-if="displayExtras" :left="left" :media="mediaInternal" :entry="entry">
          <slot></slot>
        </MediaCardPopout>
      </transition>

      <div v-if="entry && mediaInternal.nextAiringEpisode && mediaInternal.nextAiringEpisode.episode - 1 > entry.progress" class="is-behind"></div>
    </div>
  </a>
</template>

<script>
  import {formatTime, queryAL} from "../../../assets/js/utils";
  import updateProgressQuery from "../../../assets/graphql/update_progress.graphql"
  import MediaCardPopout from "./MediaCardPopout";

  export default {
    name: "MediaCard",
    components: {MediaCardPopout},
    data() {
      return {
        displayExtras: false,
        mediaInternal: null
      }
    },
    props: [
      "entry",
      "media",
      "left"
    ],
    created() {
      this.mediaInternal = this.media || this.entry.media;
    },
    mounted() {
      this.$refs.cover.style.backgroundImage = `url(${this.mediaInternal.coverImage.large})`;
      this.$refs.cover.style.backgroundColor = this.mediaInternal.coverImage.color;
    },
    methods: {
      timeUntilAiring() {
        return formatTime(this.mediaInternal.nextAiringEpisode.timeUntilAiring)
      },
      isComplete(entry) {
        return (!entry.media.nextAiringEpisode && entry.media.episodes && entry.progress >= entry.media.episodes) || (entry.media.chapters && entry.progress >= entry.media.chapters);
      },
      handleProgressClick() {
        const _self = this;

        let completionDate = null;
        if (this.isComplete(this.entry)) {
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

  .details-icon {
    font-size: 18px;
  }

  .details-icon.entry {
    position: absolute;
    right: -3px;
    top: -3px;
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
