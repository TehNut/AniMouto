<template>
  <div style="display:flex;flex-flow:column">
    <div class="grid">
      <MediaCard v-for="(entry, index) in media" :media="entry" :left="index % rowLength >= rowLength / 2" v-if="!expandable || (index < rowLength || expanded)" :key="entry.media.id">
        <slot scope="media" :media="entry" />
      </MediaCard>
    </div>
<!--  TODO implement expandability properly  -->
<!--    <span style="margin:15px auto auto;" v-if="expandable && media.length > rowLength">View {{ media.length - rowLength }} more</span>-->
  </div>
</template>

<script>
  import MediaCard from "../medialist/MediaCard";
  export default {
    name: "SimpleMediaGrid",
    components: {MediaCard},
    data() {
      return {
        rowLength: 4,
        expanded: false
      }
    },
    props: [
      "media",
      "expandable"
    ],
    created() {
      this.$browser.storage.local.get().then(v => {
        this.rowLength = v.wide ? 6 : 4;
      });
    }
  }
</script>

<style scoped>
  .grid {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fill, 85px);
    grid-template-rows: repeat(auto-fill, 115px);
    justify-content: center;
  }
</style>
