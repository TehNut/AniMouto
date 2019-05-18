<template>
  <QueryContainer ref="query" :query="getMedia" :responsifier="res => res.data.Media" error-text="Failed to get this media">
    <template scope="{response}">
      <div style="display:flex;flex-flow:column">
        <div class="banner" :style="'background-image:url(' + (response.bannerImage ? response.bannerImage : '') + ')'"></div>

        <div class="upper-container" :style="response.bannerImage ? '' : 'padding-top:0'">
          <div class="left-container">
            <img class="cover" :src="response.coverImage.extraLarge" :style="'background-color:' + response.coverImage.color"/>
          </div>
          <div class="right-container">
            <div class="title-container">
              <h1 class="title" style="font-size:large">
                <a :href="response.siteUrl" target="_blank">{{ response.title.userPreferred || response.title.romaji }}</a>
              </h1>
            </div>
            <div class="button-container">
              <div class="button ripple like-button" @click="favorite(response)"><i class="material-icons" :style="'font-size:initial;color:rgba(255, 255, 255, ' + (response.isFavourite ? '0.5' : '1.0') + ')'">favorite</i></div>
            </div>
          </div>
        </div>

        <div v-if="response.description">
          <h1 class="section-title">Description</h1>
          <div class="section" style="padding:10px 20px;">
            <span v-html="response.description"></span>
          </div>
        </div>

        <div v-if="response.tags && response.tags.length > 0">
          <h1 class="section-title">Tags</h1>
          <MediaTags :tags="response.tags" :is-manga="response.format === 'MANGA' || response.format === 'NOVEL'"/>
        </div>

        <div v-if="response.externalLinks && response.externalLinks.length > 0">
          <h1 class="section-title">External Links</h1>
          <div class="section external-links">
            <a v-for="link in response.externalLinks" :href="link.url" target="_blank">
              <div class="button ripple link-button" :style="'background-color:' + getSiteColor(link.site)">{{ link.site }}</div>
            </a>
          </div>
        </div>

        <div v-if="response.stats.statusDistribution">
          <h1 class="section-title"><a :href="getContextualLink(response, 'stats')" target="_blank">Status Distribution</a></h1>
          <StatusDistribution :status="formatStatus(response)"/>
        </div>

        <div v-if="response.relations && response.relations.edges.length > 0">
          <h1 class="section-title">Relations</h1>
          <div class="section">
            <RelationalMediaGrid :relations="response.relations.edges"/>
          </div>
        </div>

        <div v-if="response.characters && response.characters.edges.length > 0">
          <h1 class="section-title">
            <a :href="getContextualLink(response, 'characters')" target="_blank">Characters</a>
          </h1>
          <div class="section character-grid">
            <NamedRelation v-for="(character, index) in response.characters.edges" :entity="character.node" :role="character.role" :left="index % 4 > 1"/>
          </div>
        </div>

        <div v-if="response.staff && response.staff.edges.length > 0">
          <h1 class="section-title">
            <a :href="getContextualLink(response, 'staff')" target="_blank">Staff</a>
          </h1>
          <div class="section character-grid">
            <NamedRelation v-for="(staff, index) in response.staff.edges" :entity="staff.node" :role="staff.role" :left="index % 4 > 1"/>
          </div>
        </div>
      </div>
    </template>
  </QueryContainer>
</template>

<script>
  import {queryAL} from "../../../assets/js/utils";
  import mediaQuery from "../../../assets/graphql/media.graphql";
  import RelationalMediaGrid from "./RelationalMediaGrid";
  import NamedRelation from "./NamedRelation";
  import StatusDistribution from "./StatusDistribution";
  import QueryContainer from "../base/QueryContainer";
  import MediaTags from "./MediaTags";

  export default {
    name: "MediaView",
    components: {MediaTags, QueryContainer, StatusDistribution, NamedRelation, RelationalMediaGrid},
    data() {
      return {
        routeId: null
      }
    },
    props: [
      "id"
    ],
    methods: {
      getMedia() {
        return this.$browser.storage.local.get().then(v => {
          if (v.access_token === "")
            return Promise.reject("Invalid token");

          return queryAL(mediaQuery, { id: this.routeId || this.id }, v.access_token);
        });
      },
      formatStatus(response) {
        const status = {};
        response.stats.statusDistribution.forEach(e => status[e.status.toLowerCase()] = e.amount);
        return status;
      },
      getContextualLink(response, context) {
        return response.siteUrl + "/" + response.title.romaji.replace(/ /g, "-").replace(/[^a-zA-Z0-9\-]/, "") + "/" + context;
      },
      getSiteColor(site) {
        switch (site) {
          case "Crunchyroll": return "rgb(var(--color-orange))";
          case "Funimation":
          case "Animelab": return "#c063ff";
          case "Hulu": return "rgb(var(--color-green))";
          case "Youtube": return "rgb(var(--color-red))";
          default: return "rgb(var(--color-accent))";
        }
      },
      favorite(response) {
        const isManga = response.format === "MANGA" || response.format === "ONE_SHOT";
        this.$browser.storage.local.get().then(v => {
          if (v.access_token === "")
            return;

          queryAL(`mutation($id:Int){ToggleFavourite(${isManga ? "manga" : "anime"}Id: $id){__typename}}`, { id: response.id }, v.access_token).then(res => {
            response.isFavourite = !response.isFavourite
          })
        });
      }
    },
    activated() {
      this.$refs.query.runQuery();
    },
    beforeRouteUpdate(to, from, next) {
      this.routeId = to.params.id;
      this.$refs.query.runQuery();
      next();
    },
    beforeRouteLeave(to, from, next) {
      this.routeId = null;
      this.$refs.query.reset();
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
    padding-bottom: 10px;
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
