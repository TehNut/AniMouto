<template>
  <div class="input-wrapper">
    <span class="text-title text-h2">{{ label }}</span>
    <input 
      :type="type"
      :max="max"
      :min="min"
      v-model="input"
      :value="value"
      :placeholder="label"
      @change="e => onChange(e)"
    >
  </div>
</template>

<script lang="ts">
import { Vue, Component, VModel, Prop } from "vue-property-decorator";

@Component
export default class TextInput extends Vue {
  @VModel()
  input!: string | number;

  @Prop()
  value?: string | number;

  @Prop()
  label?: string;

  @Prop()
  max?: number;

  @Prop()
  min?: number;

  type!: "text" | "number";

  created() {
    this.type = typeof this.value === "number" ? "number" : "text";
  }

  onChange(event: Event) {
    // @ts-ignore
    let newValue = event.target.value;
    if (typeof this.input === "string" || typeof this.value === "string")
      return this.$emit("change", newValue);
    
    if (typeof this.input === "number" || typeof this.value === "number")
      return this.$emit("change", parseInt(newValue));
  }
}
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-flow: column;
  width: 50%;
}

input {
  background: rgb(var(--color-foreground-blue));
  color: rgb(var(--color-text));
  border: solid 1px rgba(var(--color-text), 0.4);
  width: 95%;
  border-radius: 4px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  padding: 5px 8px 5px 8px;
}

input::placeholder {
  color: rgba(var(--color-text-lighter), 0.8);
}

input:focus {
  outline: none;
}
</style>