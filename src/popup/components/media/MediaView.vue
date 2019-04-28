<template>
  <div>
    <transition>
      <Spinner v-if="!media"/>
    </transition>

    <div v-if="media" style="display:flex;flex-flow:column">
      <div class="banner" :style="'background-image:url(' + (media.bannerImage ? media.bannerImage : '') + ')'"></div>

      <div class="upper-container" :style="media.bannerImage ? '' : 'padding-top:0'">
        <div class="left-container">
          <img class="cover" :src="media.coverImage.extraLarge" :style="'background-color:' + media.coverImage.color"/>
        </div>
        <div class="right-container">
          <div class="title-container">
            <h1 class="title" style="font-size:large">
              <a :href="media.siteUrl" target="_blank">{{ media.title.userPreferred || media.title.romaji }}</a>
            </h1>
          </div>
          <div class="button-container">
            <div class="button ripple like-button" @click="favorite"><i class="material-icons" :style="'font-size:initial;color:rgba(255, 255, 255, ' + (media.isFavourite ? '0.5' : '1.0') + ')'">favorite</i></div>
          </div>
        </div>
      </div>

      <div v-if="media.externalLinks" class="external-links">
        <a v-for="link in media.externalLinks" :href="link.url" target="_blank">
          <div class="button ripple link-button" :style="'background-color:' + getSiteColor(link.site)">{{ link.site }}</div>
        </a>
      </div>

      <div v-if="media.description">
        <h1 class="section-title">Description</h1>
        <div class="section" style="padding:10px 20px;">
          <span v-html="media.description"></span>
        </div>
      </div>

      <div v-if="media.stats.statusDistribution">
        <h1 class="section-title"><a :href="getContextualLink('stats')" target="_blank">Status Distribution</a></h1>
        <StatusDistribution :status="formatStatus()"/>
      </div>

      <div v-if="media.relations && media.relations.edges.length > 0">
        <h1 class="section-title">Relations</h1>
        <div class="section">
          <RelationalMediaGrid :relations="media.relations.edges"/>
        </div>
      </div>

      <div v-if="media.characters && media.characters.edges.length > 0">
        <h1 class="section-title">
          <a :href="getContextualLink('characters')" target="_blank">Characters</a>
        </h1>
        <div class="section character-grid">
          <CharacterRelation v-for="(character, index) in media.characters.edges" :character="character.node" :role="character.role" :left="index % 4 > 1"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {queryAL} from "../../../assets/js/utils";
  import mediaQuery from "../../../assets/graphql/media.graphql";
  import Spinner from "../base/Spinner";
  import RelationalMediaGrid from "./RelationalMediaGrid";
  import CharacterRelation from "./CharacterRelation";
  import StatusDistribution from "./StatusDistribution";

  export default {
    name: "MediaView",
    components: {StatusDistribution, CharacterRelation, RelationalMediaGrid, Spinner},
    data() {
      return {
        media: null
      }
    },
    props: [
      "id"
    ],
    methods: {
      formatStatus() {
        const status = {};
        this.media.stats.statusDistribution.forEach(e => status[e.status.toLowerCase()] = e.amount);
        return status;
      },
      getContextualLink(context) {
        return this.media.siteUrl + "/" + this.media.title.romaji.replace(/ /g, "-").replace(/[^a-zA-Z0-9\-]/, "") + "/" + context;
      },
      getSiteColor(site) {
        switch (site) {
          case "Crunchyroll": return "rgb(var(--color-orange))";
          case "Funimation":
          case "Animelab": return "#c063ff";
          case "Hulu": return "rgb(var(--color-green))";
          default: return "rgb(var(--color-accent))";
        }
      },
      favorite() {
        const _self = this;
        const isManga = this.media.format === "MANGA" || this.media.format === "ONE_SHOT";
        this.$browser.storage.local.get().then(v => {
          if (v.access_token === "")
            return;

          queryAL(`mutation($id:Int){ToggleFavourite(${isManga ? "manga" : "anime"}Id: $id){__typename}}`, { id: _self.media.id }, v.access_token).then(res => {
            _self.media.isFavourite = !_self.media.isFavourite
          })
        });
      }
    },
    activated() {
      const _self = this;
      chrome.storage.local.get({ access_token: null }, value => {
        queryAL(mediaQuery, { id: this.id }, value.access_token).then(res => _self.media = res.data.Media);
      });
    },
    beforeRouteUpdate(to, from, next) {
      this.media = null;
      const _self = this;
      chrome.storage.local.get({ access_token: null }, value => {
        queryAL(mediaQuery, { id: to.params.id }, value.access_token).then(res => _self.media = res.data.Media);
      });
      next();
    },
    beforeRouteLeave(to, from, next) {
      this.media = null;
      next();
    }
  }
</script>

<style scoped>
  .banner {
    width: 470px;
    height: 150px;
    top: 0;
    right: 0;
    position: absolute;
    background-size: cover;
    background-position: center;
    z-index: -1;
  }

  .upper-container {
    padding-top: 50px;
    display: flex;
    flex-flow: row;
    justify-content: flex-start;
    margin-bottom: 20px;
  }

  .left-container {
    margin-right: 16px;
  }

  .right-container {
    margin-top: 100px;
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  .cover {
    width: 128px;
  }

  .button-container {
    display: flex;
    flex-flow: column;
  }

  .like-button {
    background-color: rgb(var(--color-peach));
    margin-top: 0;
    padding: 10px 10px;
  }

  .external-links {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: -10px;
    margin-bottom: 10px;
  }

  .link-button {
    margin-left: 0;
    margin-top: 0;
  }

  .character-grid {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fill, 85px);
    grid-template-rows: repeat(auto-fill, 115px);
    justify-content: center;
  }
</style>
