<template>
  <div class="checkbox">
    <input type="checkbox" :id="identifier" v-model="value" @change="$emit('input', $event.target.checked)"/>
    <label :for="identifier"></label>
    <p class="highlight checkbox-label">{{ title }}</p>
  </div>
</template>

<script>
  export default {
    name: "Checkbox",
    props: [
      "title",
      "value",
      "identifier"
    ]
  }
</script>

<style scoped>
  input[type=checkbox] {
    visibility: hidden;
  }

  .checkbox {
    position: relative;
    padding-top: 5px;
  }

  .checkbox label {
    cursor: pointer;
    position: absolute;
    width: 17px;
    height: 17px;
    top: 0;
    left: 0;
    border: rgb(var(--color-accent)) 1px solid;
    border-radius: 3px;
  }

  .checkbox label:after {
    opacity: 0.005;
    content: '';
    position: absolute;
    width: 8px;
    height: 4px;
    background: transparent;
    top: 4px;
    left: 3px;
    border: 3px solid rgb(var(--color-text-bright));
    border-top: none;
    border-right: none;
    transform: rotate(-55deg);
    transition: .2s;
  }

  .checkbox label:hover::after {
    opacity: 0.1;
  }

  .checkbox input[type=checkbox]:checked + label:after {
    opacity: 1;
  }

  .checkbox-label {
    cursor: pointer;
    font-size: 12px;
    position: absolute;
    top: -9px;
    left: 25px;
    width: 300px;
  }
</style>
