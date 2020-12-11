<template>
  <div @click="$emit('click')" class="button ripple" :style="getColorOverride()">
    {{ text }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Button extends Vue {
  @Prop()
  text!: string;

  @Prop()
  color?: string;

  getColorOverride() {
    return this.color ? { backgroundColor: this.color } : null;
  }
}
</script>

<style scoped>
.button {
  cursor: pointer;
  padding: 10px 15px;
  display: inline-flex;
  font-size: 0.9rem;
  border-radius: 4px;
  margin-right: 10px;
  margin-top: 15px;
  color: rgb(var(--color-text-bright));
  background-color: rgb(var(--color-accent));
  user-select: none;
}

.ripple {
  position: relative;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
}

.ripple:after {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform .5s, opacity 1s;
}

.ripple:active:after {
  transform: scale(0, 0);
  opacity: .3;
  transition: 0s;
}
</style>