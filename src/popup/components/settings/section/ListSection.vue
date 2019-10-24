<template>
  <div>
    <h1 class="section-title">Media List</h1>
    <div class="section">
      <h2 class="title">Rate after Completion</h2>
      <p class="subtext">When enabled, a rating window will appear when you have completed a series.</p>
      <Checkbox v-model="rateAfterComplete" title="Rate after completion" identifier="rateAfterComplete"/>

      <br/>

      <h2 class="title">Block Over-progression</h2>
      <p class="subtext">Stops you from progressing beyond the latest episode on airing series.</p>
      <Checkbox v-model="blockOverProgress" title="Block over-progression" identifier="blockOverProgress"/>

      <div class="button no-select ripple" @click="save">Save</div>
    </div>
  </div>
</template>

<script>
  import Checkbox from "../../base/Checkbox";
  export default {
    name: "ListSection",
    components: {
      Checkbox
    },
    data() {
      return {
        rateAfterComplete: false,
        blockOverProgress: false
      }
    },
    created() {
      const _self = this;
      this.$browser.storage.local.get().then(v => {
        _self.rateAfterComplete = v.rateAfterComplete || false;
        _self.blockOverProgress = v.blockOverProgress || false;
      });
    },
    methods: {
      save() {
        this.$browser.storage.local.set({
          rateAfterComplete: this.rateAfterComplete,
          blockOverProgress: this.blockOverProgress
        });
      }
    }
  }
</script>

<style scoped>

</style>
