<template>
  <a :href="url" target="_blank" :style="{
    '--popover-width': wide ? '303px' : '210px', 
  }">
    <div 
      class="person-card"
      :style="{ backgroundImage: `url(${image})` }"
      :class="{ left: !canFitPopout() }" 
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
    >
      <!-- Popover -->
      <transition name="fade">
        <div v-if="hovered" class="person-popover" :class="{ left: !canFitPopout() }">
          <div class="person-popover-container">
            <h1 class="truncate-title">{{ name }}</h1>
            <p>{{ role }}</p>
          </div>
        </div>
      </transition>
    </div>
  </a>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

const settings = namespace("settings");

@Component
export default class PersonCard extends Vue {
  @settings.Getter
  wide!: boolean;

  @Prop()
  url!: string;

  @Prop()
  image!: string;

  @Prop()
  name!: string;

  @Prop()
  role!: string;

  hovered: boolean = false;

  canFitPopout(): boolean {
    if (!this.$el)
      return true;

    const popoutWidth = this.wide ? 303 : 210;
    const bounding = this.$el.getBoundingClientRect();
    const parentBounding = this.$parent.$el.getBoundingClientRect();
    return parentBounding.right > bounding.right + popoutWidth
  }
}
</script>

<style scoped>
  .person-card {
    position: relative;
    background-size: cover;
    background-position: center;
    width: 85px;
    height: 115px;
    border-radius: 4px;
  }

  .person-popover {
    position: absolute;
    background-color: rgb(var(--color-foreground-blue));
    color: rgb(var(--color-text));
    width: var(--popover-width);
    height: 115px;
    left: 85px;
    z-index: 1;
    pointer-events: none;
  }

  .person-popover:not(.left) {
    border-radius: 0 4px 4px 0;
  }

  .person-popover.left {
    left: calc(var(--popover-width) * -1);
    border-radius: 4px 0 0 4px;
  }

  .person-popover-container {
    position: relative;
    margin: 10px;
  }

  .person-popover-container h1 {
    font-size: 14px;
  }

  .person-popover-container .truncate-title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--title-clip);
    overflow: hidden;
  }
</style>