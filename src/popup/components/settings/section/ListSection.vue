<template>
  <div>
    <h1 class="section-title">Media List</h1>
    <div class="section">
      <h2 class="title">Rate after Completion</h2>
      <p class="subtext">When enabled, a rating window will appear when you have completed a series.</p>
      <Checkbox v-model="rateAfterComplete" title="Rate after completion" identifier="rateAfterComplete"/>

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
        rateAfterComplete: false
      }
    },
    created() {
      const _self = this;
      this.$browser.storage.local.get().then(v => {
        _self.rateAfterComplete = v.rateAfterComplete || false;
      });
    },
    methods: {
      save() {
        this.$browser.storage.local.set({
          rateAfterComplete: this.rateAfterComplete
        });
      }
    }
  }
</script>

<style scoped>

</style>
