<template>
  <div class="section-wrapper">
    <h1 class="section-title">
      <slot name="title">
        {{ title }}
      </slot>
    </h1>
    <slot name="content">
      <div class="section" :style="maxContentHeight > 0 ? { maxHeight: `${maxContentHeight}px`, overflowY: 'scroll' } : ''">
        <slot/>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Section extends Vue {
  @Prop()
  title!: string;

  @Prop({ default: -1 })
  maxContentHeight!: number;
}
</script>

<style>
.section {
  background: rgb(var(--color-foreground));
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
}

.section-title {
  color: rgb(var(--color-text));
  margin: 0;
  padding: 0;
  padding-left: 20px;
  padding-bottom: 10px;
  font-size: 0.9rem;
  font-weight: bold;
}
</style>