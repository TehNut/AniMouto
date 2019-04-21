<template>
  <div :class="'popout' + (left ? ' left' : '')">
    <div class="contents">
      <p class="title">{{ media.title.userPreferred }}</p>
      <span class="progress" v-if="entry">
        Progress: {{ entry.progress }}<span v-if="getTotalCount() > 0">/{{ getTotalCount() }}</span>
        <br/>
      </span>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MediaCardPopout",
    props: [
      "entry",
      "media",
      "left"
    ],
    methods: {
      getTotalCount() {
        if (this.media.episodes)
          return this.media.episodes;
        else if (this.media.chapters)
          return this.media.chapters;

        return -1;
      }
    }
  }
</script>

<style scoped>
  .popout {
    background-color: rgb(var(--color-background));
    position: absolute;
    width: 202px;
    height: 100%;
    top: 0;
    left: 100%;
    z-index: 1;
    pointer-events: none;
  }

  .popout.left {
    left: unset;
    right: 100%;
  }

  .contents {
    padding: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
  }

  .progress {
    font-size: small;
    color: rgb(var(--color-text));
  }
</style>
