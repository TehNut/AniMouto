<template>
  <div>
    <div v-if="$apollo.queries.anime.loading">
      <Loader>
    </div>
    <div v-else-if="$apollo.queries.anime.error">
      <Error>
        {{ $apollo.queries.anime.error }}
      </Error>
    </div>
    <div v-else>
      <Section>
        <template #title>
          <a href="https://anilist.co/airing" target="_blank">Airing</a>
          <!-- TODO time behind -->
        </template>

        <div class="media-grid">
          <img 
            v-for="anime in anime"
            :key="anime.media.id"
            :src="anime.media.coverImage.large" 
            :alt="anime.media.title.userPreferred"
            width="100"
          >
        </div>
      </Section>
    </div>
  </div>
</template>

<script lang="ts">
import { AniListUser } from '@/models/User';
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import gql from "graphql-tag";
import Section from "@/components/Section.vue";
import Loader from "@/components/Loader.vue";
import Error from "@/components/Error.vue";

const user = namespace("user");

@Component({
  components: {
    Section,
    Loader,
    Error
  },
  apollo: {
    anime: {
      query: gql`
        query ($user: Int, $status: [MediaListStatus], $starred: [Int]) {
          anime: Page(perPage: 48) {
            mediaList(userId: $user, status_in: $status, mediaId_in: $starred, type: ANIME, sort: UPDATED_TIME_DESC) {
              ...active
            }
          }
          manga: Page(perPage: 48) {
            mediaList(userId: $user, status_in: $status, mediaId_in: $starred, type: MANGA, sort: UPDATED_TIME_DESC) {
              ...active
            }
          }
        }

        fragment active on MediaList {
          id
          media {
            title {
              userPreferred
            }
            id
            type
            episodes
            chapters
            siteUrl
            duration
            coverImage {
              large
              color
            }
            status
            nextAiringEpisode {
              episode
              airingAt
              timeUntilAiring
            }
          }
          progress
          updatedAt
        }
      `,
      variables() {
        return {
          user: this.user.id,
          status: [
            "CURRENT",
            "REPEATING"
          ],
        }
      },
      result(result, key) {
        this.anime = result.data.anime.mediaList;
        this.manga = result.data.manga.mediaList;
      }
    }
  }
})
export default class MediaList extends Vue {
  @user.Getter("user")
  user!: AniListUser;

  anime!: any[];

  manga!: any[];
}
</script>

<style>

</style>