<template>
  <a :href="entry.media.siteUrl" target="_blank">
    <div class="cover" :style="`background-image: url('${entry.media.coverImage.large}');`">
      todo
      <div class="cover-overlay progress">
        <span class="overlay-text">progress</span>
      </div>
    </div>
  </a>
</template>

<script>
  export default {
    name: "MediaCard",
    props: [
      "entry"
    ]
  }
</script>

<style scoped>
  .cover {
    height: 115px;
    max-height: 115px;
    width: 85px;
    background-size: cover;
    background-position: center;
    border-radius: 3px;
    position: relative;
  }

  .cover-overlay {
    background-color: rgba(var(--color-overlay), .7);
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 0;
    transition: .1s;
  }

  .progress {
    opacity: 0;
  }

  .overlay-text {
    color: rgba(var(--color-text-bright), .9);
    padding: 8px;
    display: inline-block;
    position: relative;
  }

  .progress .overlay-text {
    transition: .1s;
  }

  .progress .overlay-text:hover {
    font-weight: bold;
  }

  .is-behind {
    position: absolute;
    background-color: rgb(var(--color-red));
    height: 4px;
    width: 100%;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    bottom: 0;
  }
</style>
