<template>
  <div>
    <div v-if="$apollo.queries.media.loading">
      <Loader />
    </div>
    <div v-else-if="$apollo.queries.media.error">
      <Error>
        {{ $apollo.queries.media.error }}
      </Error>
    </div>
    <div v-else>
      <div class="banner" :style="{ backgroundImage: `url(${media.bannerImage})` }">
        <div class="banner-fade" />
        <div class="header">
          <img class="cover" :src="media.coverImage.extraLarge" :alt="media.title.userPreferred" />
          <div class="header-info" ref="title">
            <p>{{ $t(`media.format_${(media.format || 'unknown').toLowerCase()}`) }} &#183; {{ $t(`media.status_${media.status.toLowerCase()}`) }}</p>
            <h2>{{ media.title.userPreferred }}</h2>
            <div class="buttons">
              <Tooltip style="margin: 0 5px;" direction="left" :content="$t(`media.${media.isFavorite ? 'remove' : 'add'}_favorite`)">
                <Button 
                  color="rgb(var(--color-red))" 
                  :style="`margin:0;color:rgba(var(--color-white), ${media.isFavorite ? '0.5' : '0.99'})`"
                  @click="toggleFavorite()"
                >
                  <fa-icon icon="heart" />
                </Button>
              </Tooltip>
              <Tooltip style="margin: 0 5px;" direction="left" :content="$t('search.add_planning')">
                <Button
                  :disabled="!canPlan()"
                  style="margin:0"
                  @click="setStatus('PLANNING')"
                >
                  <fa-icon icon="notes-medical" />
                </Button>
              </Tooltip>
              <Tooltip style="margin: 0 5px;" direction="left" :content="$t(`search.add_current`)">
                <Button
                  :disabled="!canWatch()"
                  style="margin:0"
                  @click="setStatus('CURRENT')"
                >
                  <fa-icon icon="plus" />
                </Button>
              </Tooltip>
              <Tooltip style="margin: 0 5px;" direction="left" :content="$t('search.add_repeat')">
                <Button
                  :disabled="!canRewatch()"
                  style="margin:0"
                  @click="setStatus('REPEATING')"
                >
                  <fa-icon icon="redo" />
                </Button>
              </Tooltip>
              <Tooltip style="margin: 0 5px;" direction="left" :content="$t('media.delete')">
                <Button
                  :disabled="!canDelete()"
                  color="rgb(var(--color-red))"
                  style="margin:0"
                  @click="deleteEntry()"
                >
                  <fa-icon icon="trash" />
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <div class="media-content">
        <Section :title="$t('media.description')" :maxContentHeight="400" v-if="media.description">
          <span class="description" v-html="media.description.replace(/<br><br \/>/g, '<br>').replace(/\\n/g, '')" />
        </Section>
        <Section v-if="characters.length > 0">
          <template #title>
            <a :href="getContextualLink('characters')" target="_blank">{{ $t("media.characters") }}</a>
          </template>
          <div class="relation-grid">
            <PersonCard 
              v-for="character in characters"
              :key="character.id"
              :url="character.node.siteUrl" 
              :image="character.node.image.large" 
              :name="character.node.name.userPreferred" 
              :role="getCharacterRole(character)"
            />
          </div>
        </Section>
        <Section v-if="staff.length > 0">
          <template #title>
            <a :href="getContextualLink('staff')" target="_blank">{{ $t("media.staff") }}</a>
          </template>
          <div class="relation-grid">
            <PersonCard 
              v-for="staffer in staff"
              :key="staffer.id"
              :url="staffer.node.siteUrl" 
              :image="staffer.node.image.large" 
              :name="staffer.node.name.userPreferred" 
              :role="staffer.role"
            />
          </div>
        </Section>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";
import gql from "graphql-tag";
import Section from "@/components/Section.vue";
import Loader from "@/components/Loader.vue";
import Error from "@/components/Error.vue";
import Button from "@/components/Button.vue";
import Tooltip from "@/components/Tooltip.vue";
import PersonCard from "@/components/PersonCard.vue";
import { readableEnum } from "@/Utils";

const settings = namespace("settings");

@Component({
  components: {
    Section,
    Loader,
    Error,
    Button,
    Tooltip,
    PersonCard
  },
  apollo: {
    media: {
      query: gql`
        query ($id: Int!) {
          media: Media(id: $id) {
            id
            coverImage {
              extraLarge
            }
            bannerImage
            title {
              userPreferred
            }
            mediaListEntry {
              id
              status
            }
            siteUrl
            description(asHtml: true)
            isFavorite: isFavourite
            format
            status(version: 2)
            type
            staff(perPage: 12, sort: [RELEVANCE, ID]) {
              edges {
                id
                role
                node {
                  id
                  name {
                    userPreferred
                  }
                  image {
                    large
                  }
                  siteUrl
                }
              }
              pageInfo {
                total
              }
            }
            characters(perPage: 12, sort: [ROLE, RELEVANCE, ID]) {
              edges {
                id
                role
                node {
                  id
                  name {
                    userPreferred
                  }
                  image {
                    large
                  }
                  siteUrl
                }
              }
              pageInfo {
                total
              }
            }
          }
        }
      `,
      variables() {
        return {
          id: this.$route.params.id
        }
      }
    }
  }
})
export default class Media extends Vue {

  @settings.Getter
  wide!: boolean;

  media!: any;

  getContextualLink(context: string) {
    return this.media.siteUrl + "/" + this.media.title.userPreferred.replace(/ /g, "-").replace(/[^a-zA-Z0-9\-]/, "") + "/" + context;
  }

  canPlan(): boolean {
    return this.media.mediaListEntry === null;
  }

  canWatch(): boolean {
    if (this.media.status === "NOT_YET_RELEASED")
      return false;
      
    if (!this.media.mediaListEntry)
      return true;
    
    const status = this.media.mediaListEntry.status;
    return ![ "CURRENT", "COMPLETED", "REPEATING" ].includes(status);
  }

  canRewatch(): boolean {
    return this.media.mediaListEntry?.status === "COMPLETED";
  }

  canDelete(): boolean {
    return this.media.mediaListEntry !== null;
  }

  async toggleFavorite() {
    const { errors } = await this.$apollo.mutate({
      mutation: gql`
        mutation($animeId: Int, $mangaId: Int) {
          ToggleFavourite(animeId: $animeId, mangaId: $mangaId) {
            anime {
              pageInfo {
                total
              }
            }
          }
        }
      `,
      variables: {
        animeId: this.media.type === "ANIME" ? this.media.id : undefined,
        mangaId: this.media.type === "MANGA" ? this.media.id : undefined,
      }
    });

    if (!errors)
      this.media.isFavorite = !this.media.isFavorite;
  }

  async setStatus(status: "CURRENT" | "REPEATING" | "PLANNING") {
    const { data } = await this.$apollo.mutate({
      mutation: gql`mutation($id: Int!, $status: MediaListStatus) SaveMediaListEntry(id: $id, status: $status) { status }`,
      variables: {
        id: this.media.mediaListEntry.id,
        status
      }
    });

    if (data?.SaveMediaListEntry)
      this.media.mediaListEntry.status = data.SaveMediaListEntry.status;
  }

  async deleteEntry() {
    const { data } = await this.$apollo.mutate({
      mutation: gql`mutation($id: Int!) DeleteMediaListEntry(id: $id) { deleted }`,
      variables: {
        id: this.media.mediaListEntry.id
      }
    });

    if (data?.DeleteMediaListEntry?.deleted)
      this.media.mediaListEntry = null;
  }

  get characters(): any[] {
    if (this.media.characters.pageInfo.length === 0)
      return [];

    return this.media.characters.edges
      .slice(0, Math.min(this.media.characters.edges.length, this.wide ? 12 : 8));
  }

  get staff(): any[] {
    if (this.media.staff.pageInfo.length === 0)
      return [];

    return this.media.staff.edges
      .slice(0, Math.min(this.media.staff.edges.length, this.wide ? 12 : 8));
  }

  getCharacterRole(character: any) {
    return readableEnum(character.role)
  }
}
</script>

<style scoped>
.banner {
  position: absolute;
  width: 100%;
  height: 20%;
  top: 0;
  left: 0;
  /* Dark theme background */
  background-color: rgb(39, 44, 56); 
  background-position: center;
  background-size: cover;
}

.banner-fade {
  position: absolute;
  background: linear-gradient(180deg, rgba(var(--color-shadow), 0) 40%, rgba(var(--color-shadow), .6));
  height: 100%;
  width: 100%;
}

.header {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 20px;
}

.cover {
  width: 170px;
  height: 250px;
  object-fit: cover;
  z-index: 1;
}

.header-info {
  flex-grow: 1;
  height: 250px;
  margin-left: 10px;
  margin-right: 30px;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.header-info > p {
  margin-top: 80px;
  color: rgb(var(--color-white));
  font-weight: 600;
}

.header-info > h2 {
  flex-grow: 1;
  margin-top: 5px;
  color: rgb(var(--color-text));
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 10px;
}

.buttons {
  display: flex;
}

.buttons > :first-child {
  margin-left: 0 !important;
}

.buttons > :last-child {
  margin-right: 0 !important;
}

.media-content {
  margin-top: 280px;
}

.description {
  font-size: 13px;
  line-height: 15px;
}

.description > :first-child {
  margin-top: 0;
}

.description > :last-child {
  margin-bottom: 0;
}

.relation-grid {
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(auto-fill, 85px);
  grid-template-rows: repeat(auto-fill, 115px);
}

.relation-grid img {
  width: 85px;
  height: 115px;
  object-fit: cover;
}
</style>