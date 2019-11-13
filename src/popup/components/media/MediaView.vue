<template>
  <QueryContainer ref="query" :query="getMedia" :responsifier="formatResponse" error-text="Failed to get this media">
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
              <div class="button ripple star-button" @click="toggleStar(response)"><i class="material-icons" :style="'font-size:initial;color:rgba(255, 255, 255, ' + (response.starred ? '0.5' : '1.0') + ')'">star</i></div>
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
            <SimpleMediaGrid :media="response.relations.edges">
              <template scope="{media}">
                <div>
                  <span class="highlight" style="font-weight:bold">{{ displayify(media.__relation.relationType) }}</span>
                  <span class="status">{{ displayify(media.format) + " · " + displayify(media.status) }}</span>
                </div>
              </template>
            </SimpleMediaGrid>
          </div>
        </div>

        <div v-if="response.recommendations && response.recommendations.nodes.length > 0">
          <h1 class="section-title">Recommendations</h1>
          <div class="section">
            <div style="display:flex;flex-flow:column">
              <SimpleMediaGrid :media="response.recommendations.nodes" :expandable="true">
                <template scope="{media}">
                  <div>
                    <span class="highlight" :style="`font-weight:bold;color:${media.__rating.rating > 0 ? 'green' : media.__rating.rating < 0 ? 'red' : 'inherit'}`">
                      {{ media.__rating.rating > 0 ? "+" : "" }}{{ media.__rating.rating }} vote{{ media.__rating.rating > 1 || media.__rating.rating < -1 ? "s" : "" }}
                      <span v-if="media.__rating.userRating !== 'NO_RATING'"></span>
                    </span>
                    <span class="status">{{ displayify(media.format) + " · " + displayify(media.status) }}</span>
                  </div>
                </template>
              </SimpleMediaGrid>
            </div>
          </div>
        </div>

        <div v-if="response.characters && response.characters.edges.length > 0">
          <h1 class="section-title">
            <a :href="getContextualLink(response, 'characters')" target="_blank">Characters</a>
          </h1>
          <div class="section character-grid">
            <NamedRelation v-for="(character, index) in response.characters.edges" :entity="character.node" :role="character.role" :left="index % rowCount >= rowCount / 2"/>
          </div>
        </div>

        <div v-if="response.staff && response.staff.edges.length > 0">
          <h1 class="section-title">
            <a :href="getContextualLink(response, 'staff')" target="_blank">Staff</a>
          </h1>
          <div class="section character-grid">
            <NamedRelation v-for="(staff, index) in response.staff.edges" :entity="staff.node" :role="staff.role" :left="index % rowCount >= rowCount / 2"/>
          </div>
        </div>
      </div>
    </template>
  </QueryContainer>
</template>

<script>
  import {displayify, queryAL} from "../../../assets/js/utils";
  import mediaQuery from "../../../assets/graphql/media.graphql";
  import NamedRelation from "./NamedRelation";
  import StatusDistribution from "./StatusDistribution";
  import QueryContainer from "../base/QueryContainer";
  import MediaTags from "./MediaTags";
  import SimpleMediaGrid from "../base/SimpleMediaGrid";

  export default {
    name: "MediaView",
    components: {
      SimpleMediaGrid, MediaTags, QueryContainer, StatusDistribution, NamedRelation},
    data() {
      return {
        routeId: null,
        rowCount: 4
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
      formatResponse(response) {
        response = response.data.Media;

        // Reformat relation structure
        if (response.relations && response.relations.edges.length > 0) {
          response.relations.edges = response.relations.edges.map(e => {
            e.node.__relation = {
              relationType: e.relationType
            };
            return e.node;
          });
        }

        // Reformat recommendation structure
        if (response.recommendations && response.recommendations.nodes.length > 0) {
          response.recommendations.nodes = response.recommendations.nodes.map(e => {
            e.mediaRecommendation.__rating = {
              rating: e.rating,
              userRating: e.userRating
            };
            return e.mediaRecommendation;
          });
        }

        if (response.mediaListEntry) {
          this.$browser.storage.local.get().then(v => {
            response.starred = v.starred && v.starred.includes(response.id);
          });
        }

        return response;
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
      },
      toggleStar(media) {
        this.$browser.storage.local.get().then(v => {
          if (!v.starred)
            v.starred = [];

          if (v.starred.includes(media.id))
            v.starred = v.starred.filter(e => e !== media.id);
          else
            v.starred.push(media.id);

          media.starred = !media.starred;
          this.$browser.storage.local.set({ starred: v.starred });
        });
      },
      displayify(value) {
        return displayify(value);
      }
    },
    activated() {
      this.$refs.query.runQuery();
      setRowCount(this);
    },
    beforeRouteUpdate(to, from, next) {
      this.routeId = to.params.id;
      this.$refs.query.runQuery();
      setRowCount(this);
      next();
    },
    beforeRouteLeave(to, from, next) {
      this.routeId = null;
      this.$refs.query.reset();
      next();
    }
  }

  function setRowCount(self) {
    self.$browser.storage.local.get().then(v => {
      self.rowCount = v.wide ? 6 : 4;
    });
  }
</script>

<style scoped>
  .banner {
    width: 100%;
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

  .star-button {
    background-color: rgb(var(--color-yellow));
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

  .status {
    position: absolute;
    bottom: 10px;
    left: 10px;
    color: rgb(var(--color-text));
  }
</style>
