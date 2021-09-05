<template>
  <div>
    <Section>
      <template #title>
        <span>AniMouto v{{ getVersion() }}</span>
        <br>
        <p class="subtitle">A little sister to enhance your AniList experience.</p>
      </template>
      <div class="about">
        <div>
          <p>AniMouto is developed by <a href="https://anilist.co/user/42069" target="_blank">TehNut</a> and the source code is available on <a href="https://github.com/TehNut/AniMouto" target="_blank">GitHub</a>.</p>
          <p>In order to get this rewrite shipped, I skimped on this page. Can you tell?</p>
        </div>
        <a href="https://animouto.moe" target="_blank">
          <img src="img/animouto_128x.png" alt="AniMouto Logo" width="100" height="100">
        </a>
      </div>
    </Section>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import browser from "webextension-polyfill";
import Section from "@/components/Section.vue";

@Component({
  components: {
    Section
  }
})
export default class About extends Vue {
  getVersion() {
    // @ts-ignore
    return browser.runtime.getManifest().version;
  }
}
</script>

<style>
.subtitle {
  font-size: 12px;
  margin: 0;
  margin-left: 5px;
  font-weight: normal;
}

.about {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  font-size: 14px;
}
</style>