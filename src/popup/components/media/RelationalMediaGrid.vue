<template>
  <div class="grid">
    <MediaCard v-for="(relation, index) in relations" :media="relation.node" :left="index % 4 >= 2">
      <span class="highlight" style="font-weight:bold">{{ displayify(relation.relationType) }}</span>
      <span class="status">{{ displayify(relation.node.format) + " · " + displayify(relation.node.status) }}</span>
    </MediaCard>
  </div>
</template>

<script>
  import MediaCard from "../medialist/MediaCard";
  export default {
    name: "SimpleGrid",
    components: {MediaCard},
    props: [
      "relations"
    ],
    methods: {
      displayify(value) {
        value = value.split("_");
        let ret = "";
        value.forEach(e => ret += (ret.length === 0 ? "" : " " ) + e.charAt(0) + e.substring(1).toLowerCase());
        return ret;
      }
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
