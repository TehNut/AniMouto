<template>
  <div class="section distribution-container">
    <div v-for="entry in Object.entries(status)" v-if="entry[1] > 0" :class="'entry ' + entry[0]">
      <div class="button distribution">{{ displayify(entry[0]) }}</div>
      <span style="text-align:center">{{ entry[1] }}</span>
    </div>
    <div class="bar">
      <div ref="currentBar" class="current segment"></div>
      <div ref="planningBar" class="planning segment"></div>
      <div ref="completedBar" class="completed segment"></div>
      <div ref="droppedBar" class="dropped segment"></div>
      <div ref="pausedBar" class="paused segment"></div>
    </div>
  </div>
</template>

<script>
  import {displayify} from "../../../assets/js/utils";

  export default {
    name: "StatusDistribution",
    props: [
      "status"
    ],
    methods: {
      displayify(value) {
        return displayify(value);
      }
    },
    mounted() {
      let total = 0;
      Object.values(this.status).forEach(e => total += e);
      Object.entries(this.status).forEach(e => {
        this.$refs[e[0].toLowerCase() + "Bar"].style.width = (e[1] / total * 100) + "%";
      });
    }
  }
</script>

<style scoped>
  .distribution-container {
    display: flex;
    flex-flow: row;
    justify-content: space-evenly;
    position: relative;
  }

  .button.distribution {
    background-color: rgb(var(--status-color));
    cursor: unset;
    padding: 5px 10px;
    margin: 3px;
    text-transform: capitalize;
  }

  .entry {
    color: rgb(var(--status-color));
    display: flex;
    flex-flow: column;
  }

  .bar {
    display: flex;
    flex-flow: row;
    position: absolute;
    width: 100%;
    height: 10px;
    bottom: 0;
  }

  .segment {
    position: relative;
    height: 100%;
    background-color: rgb(var(--status-color));
    content: "";
  }

  .current {
    --status-color: var(--color-green);
    border-bottom-left-radius: 3px;
  }

  .planning {
    --status-color: var(--color-blue);
  }

  .completed {
    --status-color: var(--color-purple);
  }

  .dropped {
    --status-color: var(--color-peach);
  }

  .paused {
    --status-color: var(--color-orange);
    border-bottom-right-radius: 3px;
  }
</style>
