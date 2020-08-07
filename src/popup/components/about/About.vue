<template>
  <div>
    <h1 class="section-title">{{ $t("app.about.name", { version: $browser.runtime.getManifest().version }) }}</h1>
    <p class="subtext" style="padding-left:30px;">{{ $t("app.about.description") }}</p>
    <img class="animouto-icon" src="../../../assets/img/animouto.svg"/>

    <h1 class="section-title">{{ $t("app.about.links.title") }}</h1>
    <div class="section link-flow">
      <Link name="anilist" section="links" url="https://anilist.co" image="anilist.png"/>
      <Link name="homepage" section="links" url="https://animouto.moe/" image="animouto.png"/>
      <Link name="github" section="links" url="https://github.com/TehNut/AniMouto" image="github.png"/>
    </div>

    <h1 class="section-title">{{ $t("app.about.built_with.title") }}</h1>
    <div class="section link-flow">
      <Link name="node" section="built_with" url="https://nodejs.org/" image="node.png"/>
      <Link name="vue" section="built_with" url="https://vuejs.org/" image="vue.png"/>
      <Link name="webpack" section="built_with" url="https://webpack.js.org/" image="webpack.png"/>
      <Link name="graphql" section="built_with" url="https://graphql.org/" image="graphql.svg"/>
      <Link name="material_design" section="built_with" url="https://material.io/" image="material.svg"/>
    </div>

    <h1 class="section-title"><a href="https://github.com/TehNut/AniMouto/releases" target="_blank">{{ $t("app.about.changelog") }}</a></h1>
    <QueryContainer :query="getChangelog" class="section changelog">
      <div slot-scope="{response}">
        <div v-for="version in getValidChanges(response)">
          <span v-html="version.text"></span>
          <div v-if="!version.last" class="spacer" style="top:8px;"></div>
        </div>
      </div>
    </QueryContainer>
  </div>
</template>

<script>
  import Link from "./Link";
  import QueryContainer from "../base/QueryContainer";
  import Marked from "marked";

  const renderer = new Marked.Renderer();
  renderer.link = (href, title, text) => {
    const link = Marked.Renderer.prototype.link.apply(Marked, [href, title, text]);
    return link.replace("<a", "<a target='_blank'");
  };
  renderer.heading = (text, level, raw, slugger) => {
    level -= 1;
    if (level !== 1)
      return Marked.Renderer.prototype.heading.apply(Marked, [text, level, raw, slugger]);

    return `<a href="${"https://github.com/TehNut/AniMouto/releases/tag/v" + text}" target="_blank"><h1>${text}</h1></a>`
  };
  Marked.setOptions({
    renderer: renderer
  });

  export default {
    name: "About",
    components: {QueryContainer, Link},
    methods: {
      getChangelog() {
        return fetch("https://api.github.com/repos/TehNut/AniMouto/releases").then(res => res.json());
      },
      getValidChanges(response) {
        const changes = [];
        for (let i = 0; i < Math.min(5, response.length); i++)
          if (response[i].tag_name.startsWith("v2"))
            changes.push({text: Marked.parse(response[i].body)});

        changes[changes.length - 1].last = true;
        return changes;
      }
    }
  }
</script>

<style scoped>
  .animouto-icon {
    width: 100px;
    position: absolute;
    top: 0;
    right: 10px;
  }

  .link-flow {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(auto-fill, 64px);
    grid-template-rows: repeat(auto-fill, 64px);
    justify-content: center;
  }

  .changelog {
    position: relative;
    height: 400px;
    max-height: 400px;
    padding-top: 10px;
    overflow-y: scroll;
  }

  .changelog::-webkit-scrollbar {
    width: 5px;
  }
</style>
