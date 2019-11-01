<template>
  <div>
    <div v-for="entry in Object.entries(stateConfig)" :key="entry[0]">
      <div class="section-header">
        <h1 class="section-title">{{ entry[1].title }}</h1>
      </div>
      <div class="section">
        <div v-for="option in entry[1].options">
          <h2 class="title">{{ option.title }}</h2>
          <p class="subtext" v-html="option.description"></p>
          <Checkbox v-if="typeof option.defaultValue === 'boolean'" v-model="option.value" :title="option.tag || option.title" :identifier="option.title.replace(/ /g, '-').toLowerCase()"/>
          <div v-else-if="typeof option.defaultValue === 'number'">
            <input type="number" v-model.number="option.value" class="text-input settings-text-input" :placeholder="option.value || option.defaultValue" autocomplete="off"/>
            <span class="highlight settings-text-input-label">{{ option.tag || option.title }}</span>
          </div>
          <br/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Checkbox from "./Checkbox";

  export default {
    name: "SimpleConfig",
    components: {Checkbox},
    data() {
      return {
        stateConfig: this.config
      }
    },
    props: [
      "config"
    ],
    methods: {
      save() {
        // this.$browser.storage.local.set({ config: this.stateConfig });
        console.log(this.stateConfig)
      }
    },
    deactivated() {
      // this.$browser.storage.local.set({ config: this.stateConfig });
    }
  }
</script>

<style scoped>
  .settings-text-input {
    background-color: rgb(var(--color-background));
    width: 50px;
    margin-left: 0;
    margin-right: 5px;
    display: unset;
  }

  .settings-text-input-label {
    font-size: 14px;
    align-self: center;
  }

  .section-header {
    display: flex;
    justify-content: flex-start;
  }

  .reset-button {

  }
</style>
