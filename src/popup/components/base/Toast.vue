<template>
  <div :class="'toast-container ' + (toast.error ? 'red' : 'accent')">
    <span v-html="toast.message"></span>
  </div>
</template>

<script>
  export default {
    name: "Toast",
    props: [
      "toast"
    ]
  }
</script>

<style scoped>
  .toast-container {
    width: 75%;
    padding: 10px;
    text-align: center;
    color: rgb(var(--color-text-bright));
    border-radius: 3px;
    margin-bottom: 10px;
    margin-left: auto;
    margin-right: auto;
  }

  .toast-container.red {
    background-color: rgba(var(--color-red), 0.8);
  }

  .toast-container.accent {
    background-color: rgba(var(--color-accent), 0.8);
  }
</style>
