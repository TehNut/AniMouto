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
          <div class="ellipsis overlay-text details-icon" @click.prevent="navigate"></div>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="entry && displayExtras" class="cover-overlay extras-overlay ripple" ref="rippler">
          <span class="overlay-text progress-text" @click.prevent="handleProgressClick">{{ entry.progress }} +</span>
          <div class="ellipsis overlay-text details-icon entry" @click.prevent="navigate"></div>
        </div>
      </transition>

      <transition name="fade">
        <MediaCardPopout v-if="displayExtras" :left="left" :media="mediaInternal">
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
      navigate() {
        this.displayExtras = false;
        this.$router.push({ name: 'media-view', params: { id: this.mediaInternal.id } });
      },
      timeUntilAiring() {
        return formatTime(this.mediaInternal.nextAiringEpisode.timeUntilAiring)
      },
      isComplete(progress, entry) {
        return (!entry.media.nextAiringEpisode && entry.media.episodes && progress >= entry.media.episodes) || (entry.media.chapters && progress >= entry.media.chapters);
      },
      handleProgressClick() {
        const _self = this;

        this.$browser.storage.local.get().then(v => {
          if (v.blockOverProgress) {
            const total = this.mediaInternal.chapters || this.mediaInternal.episodes || null;
            if (total) {
              const nextProgress = this.entry.progress + 1;
              let flag = true;
              if (nextProgress > total)
                flag = false;

              if (this.mediaInternal.nextAiringEpisode && nextProgress >= this.mediaInternal.nextAiringEpisode.episode)
                flag = false;

              if (!flag) {
                this.$refs.rippler.classList.add("error-ripple");
                this.$refs.cover.classList.add("error-shake");
                setTimeout(() => {
                  this.$refs.cover.classList.remove("error-shake");
                }, 100);
                return;
              }
            }
          }

          if (v.access_token === "")
            return;

          const variables = { listId: this.entry.id, progress: this.entry.progress + 1 };
          if (variables.progress === 1)
            variables.startDate = getToday();
          if (this.isComplete(variables.progress, _self.entry))
            variables.completionDate = getToday();

          queryAL(updateProgressQuery, variables, v.access_token)
            .then(res => {
              const diff = res.data.SaveMediaListEntry.progress - _self.entry.progress;
              _self.entry.progress = res.data.SaveMediaListEntry.progress;
              _self.$emit("updateProgress", { id: _self.entry.media.id, newProgress: _self.entry.progress, diff: { progress: diff, timeDiff: diff * _self.mediaInternal.duration } });
            });
        });
      }
    }
  }

  function getToday() {
    let currentDate = new Date(Date.now());
    return { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
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
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 0;
    transition: .1s;
  }

  .extras-overlay {
    display: flex;
    justify-content: space-between;
  }

  .overlay-text {
    color: rgba(var(--color-text-bright), .9);
    padding: 8px;
    display: inline-block;
    position: relative;
  }

  .details-icon {
    font-size: 18px;
    transition: .2s;
  }

  .details-icon.entry {
    position: absolute;
    width: 30%;
    right: -8px;
    top: -3px;
  }

  .details-icon:hover {
    color: rgb(var(--color-accent));
  }

  .progress-text {
    transition: .1s;
    width: 50%;
    text-align: right;
  }

  .progress-text:hover {
    font-weight: bold;
    color: rgb(var(--color-accent));
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

  .ellipsis:after {
    content: '\2807';
  }

  .error-ripple:after {
    background-image: radial-gradient(circle, #ff0000 10%, transparent 10.01%);
  }

  .error-shake {
    animation: shake .1s;
    animation-iteration-count: 1;
    z-index: 10;
  }

  @keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
  }
</style>
