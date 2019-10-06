<template>
  <div class="grid">
    <MediaCard v-for="(relation, index) in relations" :media="relation.node" :left="index % rowCount >= rowCount / 2">
      <span class="highlight" style="font-weight:bold">{{ displayify(relation.relationType) }}</span>
      <span class="status">{{ displayify(relation.node.format) + " · " + displayify(relation.node.status) }}</span>
    </MediaCard>
  </div>
</template>

<script>
  import {displayify} from "../../../assets/js/utils";
  import MediaCard from "../medialist/MediaCard";
  export default {
    name: "SimpleGrid",
    components: {MediaCard},
    data() {
      return {
        rowCount: 4
      }
    },
    props: [
      "relations"
    ],
    methods: {
      displayify(value) {
        return displayify(value);
      }
    },
    created() {
      this.$browser.storage.local.get().then(v => {
        this.rowCount = v.wide ? 6 : 4;
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

  .status {
    position: absolute;
    bottom: 10px;
    left: 10px;
    color: rgb(var(--color-text));
  }
</style>
