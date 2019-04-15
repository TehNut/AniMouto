<template>
  <div class="loading-container">
    <div class="spinner"></div>
  </div>
</template>

<script>
  export default {
    name: "Spinner"
  }
</script>

<style>
  .spinner {
    position: absolute;
    width: 48px;
    height: 35px;
    display: block;
  }

  .spinner:before, .spinner:after {
    position: absolute;
    content: "";
    top: 50%;
    left: 50%;
    margin: -8px 0 0 -8px;
    width: 16px;
    height: 16px;
    border-radius: 100%;
    border-color: rgb(var(--color-accent)) transparent transparent;
    border-style: solid;
    border-width: 2px;
    box-shadow: 0 0 0 1px transparent;
  }

  .spinner:before {
    animation: spinning 2.4s cubic-bezier(0.41, 0.26, 0.2, 0.62);
    animation-iteration-count: infinite;
  }

  .spinner:after {
    animation: spinning 2.4s cubic-bezier(0.51, 0.09, 0.21, 0.8);
    animation-iteration-count: infinite;
  }
</style>

<style scoped>
  .loading-container {
    width: 100%;
    height: auto;
    display: flex;
    flex-flow: row;
    justify-content: center;
  }

  .spinner {
    top: 25%;
    width: 64px;
    height: 64px;
  }

  .spinner:before, .spinner:after {
    margin: -32px 0 0 -32px;
    width: 64px;
    height: 64px;
    border-width: 8px;
  }
</style>
