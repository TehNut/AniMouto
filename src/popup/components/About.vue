<template>
  <div>
    <h1 class="section-title">AniMouto v{{ $browser.runtime.getManifest().version }}</h1>
    <p class="subtext" style="padding-left:30px;">A little sister to enhance your AniList experience.</p>
    <img class="animouto-icon" src="../../assets/img/animouto.svg"/>

    <h1 class="section-title">Links</h1>
    <div class="section">
      <a href="https://tehnut.info/" target="_blank">
        <h2 class="highlight-hover title">Homepage</h2>
      </a>
      <p class="subtext">My personal page. Has links to other projects and places to find me.</p>

      <a href="https://github.com/TehNut/AniMouto" target="_blank">
        <h2 class="highlight-hover title">GitHub</h2>
      </a>
      <p class="subtext">AniMouto is open source and licensed under the <a href="https://opensource.org/licenses/MIT" target="_blank" class="highlight">MIT</a> license.</p>

      <a href="https://anilist.co/" target="_blank">
        <h2 class="highlight-hover title">AniList</h2>
      </a>
      <p class="subtext">This extension's onii-chan.</p>
    </div>

    <h1 class="section-title">Credits</h1>
    <div class="section">
      <a class="highlight" href="https://anilist.co/" target="_blank">
        <h2 class="highlight-hover title">AniList</h2>
      </a>
      <p class="subtext">AniList provides the styling and theme that this extension follows as well as the API that powers it.</p>

      <a href="https://material.io/" target="_blank">
        <h2 class="highlight-hover title">Material Design</h2>
      </a>
      <p class="subtext">All the icons used are provided by Material.</p>
    </div>
  </div>
</template>

<script>
  import Spinner from "./base/Spinner";
  export default {
    name: "About",
    components: {Spinner}
  }
</script>

<style scoped>
  .animouto-icon {
    width: 100px;
    position: absolute;
    top: 0;
    right: 10px;
  }

  .bad-link {
    transition: .3s;
  }

  .bad-link:hover {
    color: rgb(var(--color-red));
    cursor:not-allowed;
  }
</style>
