<template>
  <div :class="'popout' + (left ? ' left' : '')">
    <div class="contents">
      <p class="title">{{ media.title.userPreferred }}</p>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MediaCardPopout",
    props: [
      "media",
      "left"
    ]
  }
</script>

<style scoped>
  .popout {
    background-color: rgb(var(--color-background));
    position: absolute;
    width: 202px;
    height: 100%;
    top: 0;
    left: 100%;
    z-index: 1;
    pointer-events: none;
    border-radius: 0 3px 3px 0;
  }

  .popout.left {
    left: unset;
    right: 100%;
    border-radius: 3px 0 0 3px;
  }

  .contents {
    padding: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
  }
</style>
