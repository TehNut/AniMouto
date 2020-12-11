<template>
  <div>
    <label>
      <input type="checkbox" v-model="checked" @change="$emit('change', checked)">
      <span class="checkmark"></span>
      <slot/>
    </label>
  </div>
</template>

<script lang="ts">
import { Vue, Component, VModel } from "vue-property-decorator";

@Component
export default class Checkbox extends Vue {
  @VModel()
  checked!: boolean;
}
</script>

<style scoped>
label {
  display: flex;
  align-items: center;
  height: 25px;
  position: relative;
  font-size: 1rem;
  padding-left: 35px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  transition: .2s;
  border: solid 1px rgba(var(--color-text), 0.4);
  border-radius: 4px;
  background-color: rgba(var(--color-foreground), 0.8);
}

label:hover input ~ .checkmark {
  background-color: rgb(var(--color-foreground-blue));
}

label:hover input:not(:checked) ~ .checkmark:after {
  opacity: 1;
  border: solid rgba(var(--color-text-light), 0.5);
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

label input:checked ~ .checkmark {
  background-color: rgb(var(--color-accent));
}

.checkmark:after {
  content: "";
  position: absolute;
  opacity: 0;
  transition: .2s;
}

label input:checked ~ .checkmark:after {
  opacity: 1;
}

label .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid rgb(var(--color-text-bright));
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>