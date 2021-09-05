<template>
  <div @click="onClick()" class="button ripple" :style="getColorOverride()">
    <slot>
      {{ text }}
    </slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from "vue-property-decorator";

@Component
export default class Button extends Vue {
  @Prop()
  text!: string;

  @Prop()
  color?: string;

  @Prop({ default: false })
  disabled?: boolean;

  getColorOverride() {
    if (this.disabled)
      return { backgroundColor: "rgba(var(--color-text), 0.6)", color: "rgb(var(--color-text))" }

    return this.color ? { backgroundColor: this.color } : null;
  }

  onClick() {
    if (this.disabled)
      return;
    
    this.$emit("click");
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