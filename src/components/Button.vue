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

<style>
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
  background-position: center;
  transition: background 0.8s;
}
.ripple:hover {
  background: #47a7f5 radial-gradient(circle, transparent 1%, #47a7f5 1%) center/15000%;
}
.ripple:active {
  background-color: #6eb9f7;
  background-size: 100%;
  transition: background 0s;
}
</style>