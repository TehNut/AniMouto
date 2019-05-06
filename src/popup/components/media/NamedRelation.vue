<template>
  <a :href="entity.siteUrl" target="_blank">
    <div class="cover" ref="cover" @mouseenter="displayExtras = true" @mouseleave="displayExtras = false">
      <transition name="fade">
        <div v-if="displayExtras" :class="'popout' + (left ? ' left' : '')">
          <div class="contents">
            <p class="title">{{ entity.name.first + (entity.name.last ? " " + entity.name.last : "") }}</p>
            <span class="status">{{ displayify(role) }}</span>
          </div>
        </div>
      </transition>
    </div>
  </a>
</template>

<script>
  import {displayify} from "../../../assets/js/utils";

  export default {
    name: "NamedRelation",
    data() {
      return {
        displayExtras: false
      }
    },
    props: [
      "entity",
      "role",
      "left"
    ],
    methods: {
      displayify(value) {
        return displayify(value);
      }
    },
    mounted() {
      this.$refs.cover.style.backgroundImage = `url(${this.entity.image.large})`;
    },
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

  .status {
    position: absolute;
    bottom: 10px;
    left: 10px;
    color: rgb(var(--color-text));
  }
</style>
