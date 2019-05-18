<template>
  <div class="section">
    <div class="tags">
      <a v-for="tag in tags" v-if="shouldDisplay(tag)" :href="`https://anilist.co/search/${isManga ? 'manga' : 'anime'}?includedTags=${tag.name}`" target="_blank" :key="tag.name">
        <div class="button no-select tag" :style="`background-color:rgb(var(--color-${getColor(tag)}))`">
          {{ tag.name }}
          <span class="hover">
            {{ tag.description }}
          </span>
        </div>
      </a>
    </div>
    <span v-if="spoilers > 0">
      <br/>
      <p v-if="spoilers > 0" class="subtext spoiler-text" @click="showSpoilers = !showSpoilers">
        {{ (showSpoilers ? "Hide" : "Show") + " " + spoilers }} spoiler{{ spoilers !== 1 ? "s" : "" }}
      </p>
    </span>
  </div>
</template>

<script>
  export default {
    name: "MediaTags",
    props: [
      "tags",
      "isManga"
    ],
    data() {
      return {
        showSpoilers: false,
        spoilers: 0
      }
    },
    methods: {
      shouldDisplay(tag) {
        const spoiler = tag.isGeneralSpoiler || tag.isMediaSpoiler;
        return !spoiler || this.showSpoilers;
      },
      getColor(tag) {
        if (tag.isGeneralSpoiler || tag.isMediaSpoiler)
          return "orange";

        if (tag.isAdult)
          return "red";

        return "blue-dim"
      }
    },
    created() {
      this.spoilers = this.tags.filter(tag => tag.isMediaSpoiler || tag.isGeneralSpoiler).length;

    }
  }
</script>

<style scoped>
  .tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .tag {
    position: relative;
    padding: 5px 10px;
    margin: 5px;
  }

  .tag .hover {
    visibility: hidden;
    pointer-events: none;
    opacity: 0;
    width: 125px;
    bottom: 115%;
    left: 37%;
    margin-left: -65px;
    background-color: #303133;
    color: rgb(var(--color-text-bright));
    text-align: center;
    padding: 10px;
    border-radius: 5px;
    filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.5));
    position: absolute;
    z-index: 2;
    transition: .1s;
  }

  .tag:hover .hover {
    visibility: visible;
    opacity: 1;
  }

  .tag .hover::after {
    content: " ";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #303133 transparent transparent transparent;
  }

  .spoiler-text {
    text-align: center;
    margin-bottom: 0;
    padding-left: 0;
    cursor: pointer;
    color: rgb(var(--color-red));
  }
</style>
