<template>
  <a :href="url" target="_blank">
    <div class="link" :style="'background-image: url(assets/img/link/' + image + ')'">
      <span class="hover">
        <span class="highlight">{{ $t(`app.about.${section}.${name}`) }}</span>
        <br/>
        {{ $t(`app.about.${section}.${name}_desc`) }}
      </span>
    </div>
  </a>
</template>

<script>
  export default {
    name: "Link",
    props: [
      "image",
      "url",
      "section",
      "name",
    ]
  }
</script>

<style scoped>
  .link {
    position: relative;
    display: inline-block;
    width: 64px;
    height: 64px;
    background-position: center;
    background-size: cover;
    border-radius: 5px;
  }

  .link .hover {
    visibility: hidden;
    opacity: 0;
    width: 130px;
    bottom: 115%;
    left: 37%;
    margin-left: -65px;
    background-color: #303133;
    color: rgb(var(--color-text-bright));
    text-align: center;
    padding: 10px;
    border-radius: 5px;
    filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.5));
    position: absolute;
    z-index: 2;
    transition: .1s;
  }

  .link:hover .hover {
    visibility: visible;
    opacity: 1;
  }

  .link .hover::after {
    content: " ";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #303133 transparent transparent transparent;
  }
</style>
