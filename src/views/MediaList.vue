<template>
  <div :style="{ '--grid-gap': wide ? '16px' : '20px' }">
    <div v-if="$apollo.queries.anime.loading || $apollo.queries.manga.loading">
      <Loader />
    </div>
    <div v-else-if="$apollo.queries.anime.error || $apollo.queries.manga.error">
      <Error>
        {{ $apollo.queries.anime.error || $apollo.queries.manga.error }}
      </Error>
    </div>
    <div v-else>
      <Section v-if="airing.length > 0">
        <template #title>
          <div class="title-wrapper">
            <a href="https://anilist.co/airing" target="_blank">{{ $t("list.section_airing") }}</a>
            <span class="behind-text">{{ airingBehind }}</span> 
          </div>
        </template>

        <div class="media-grid">
          <MediaCard
            v-for="entry in airing"
            :key="entry.media.id"
            :listEntry="entry"
            :media="entry.media"
            :mutationTarget="$apollo.queries.anime.options"
          />
        </div>
      </Section>

      <Section v-if="watching.length > 0" class="list-section">
        <template #title>
          <div class="title-wrapper">
            <a :href="`https://anilist.co/user/${user.id}/animelist`" target="_blank">{{ $t("list.section_anime") }}</a>
            <span class="behind-text behind-warning">{{ watchingBehind }}</span> 
          </div>
        </template>

        <div class="media-grid">
          <MediaCard
            v-for="entry in watching"
            :key="entry.media.id"
            :listEntry="entry"
            :media="entry.media"
            :mutationTarget="$apollo.queries.anime.options"
          />
        </div>
      </Section>

      <Section v-if="manga.length > 0" class="list-section">
        <template #title>
          <a :href="`https://anilist.co/user/${user.id}/mangalist`" target="_blank">{{ $t("list.section_manga") }}</a>
        </template>

        <div class="media-grid">
          <MediaCard
            v-for="entry in manga"
            :key="entry.media.id"
            :listEntry="entry"
            :media="entry.media"
            :mutationTarget="$apollo.queries.manga.options"
          />
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
import MediaCard from "@/components/MediaCard.vue";
import { ListEntry } from '@/models/ListEntry';
import { readableTime, parseSeconds } from "@/Utils";

const user = namespace("user");
const settings = namespace("settings");

const listFragment = gql`
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
    status
    progress
    updatedAt
  }
`

@Component({
  components: {
    Section,
    MediaCard,
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
        }

        ${listFragment}
      `,
      variables() {
        return {
          user: this.user.id,
          status: this.status,
        }
      },
      result(res) {
        this.anime = res.data.anime.mediaList
      }
    },
    manga: {
      query: gql`
        query ($user: Int, $status: [MediaListStatus], $starred: [Int]) {
          manga: Page(perPage: 48) {
            mediaList(userId: $user, status_in: $status, mediaId_in: $starred, type: MANGA, sort: UPDATED_TIME_DESC) {
              ...active
            }
          }
        }

        ${listFragment}
      `,
      variables() {
        return {
          user: this.user.id,
          status: this.status,
        }
      },
      result(res) {
        this.manga = res.data.manga.mediaList
      }
    }
  }
})
export default class MediaList extends Vue {
  @user.Getter
  user!: AniListUser;

  @settings.Getter
  wide!: boolean;

  anime!: ListEntry[];

  manga!: ListEntry[];

  status = [ "CURRENT", "REPEATING" ];

  get airing(): ListEntry[] {
    return this.anime.filter(e => e.media.status === "AIRING" || e.media.nextAiringEpisode)
      .sort((e1, e2) => e1.media.nextAiringEpisode.timeUntilAiring - e2.media.nextAiringEpisode.timeUntilAiring);
  }

  get watching(): ListEntry[] {
    return this.anime.filter(e => e.media.status !== "AIRING" && !e.media.nextAiringEpisode);
  }

  get airingBehind(): string {
    const seriesBehind = this.airing
      .filter(m => (m.media.nextAiringEpisode.episode - 1) - m.progress > 0);

    if (seriesBehind.length <= 0)
      return "";

    const episodesBehind = seriesBehind
      .map(m => ((m.media.nextAiringEpisode.episode - 1) - m.progress))
      .reduce((prev, curr) => prev + curr);

    const minutesBehind = seriesBehind
      .map(m => ((m.media.nextAiringEpisode.episode - 1) - m.progress) * m.media.duration)
      .reduce((prev, curr) => prev + curr);

    const timeBehind = readableTime(parseSeconds(minutesBehind * 60));

    return this.$t("list.time_behind", { episodes: episodesBehind, time: timeBehind }) as string;
  }

  get watchingBehind(): string {
    const seriesBehind = this.watching
      .filter(m => m.media.episodes - m.progress > 0);

    if (seriesBehind.length <= 0)
      return "";

    const episodesBehind = seriesBehind
      .map(m => (m.media.episodes - m.progress))
      .reduce((prev, curr) => prev + curr);

    const minutesBehind = seriesBehind
      .map(m => (m.media.episodes - m.progress) * m.media.duration)
      .reduce((prev, curr) => prev + curr);

    const timeBehind = readableTime(parseSeconds(minutesBehind * 60));

    return this.$t("list.time_remaining", { episodes: episodesBehind, time: timeBehind }) as string;
  }

  created() {
    // Every minute, decrement timeUntilAiring by 1 minute
    setInterval(() => {
      this.airing.forEach(e => e.media.nextAiringEpisode.timeUntilAiring -= 60);
    }, 1000 * 60); 
  }
}
</script>

<style>
.list-section {
  padding-top: 10px;
}

.media-grid {
  display: grid;
  grid-gap: var(--grid-gap);
  grid-template-columns: repeat(auto-fill, 85px);
  grid-template-rows: repeat(auto-fill, 115px);
}

.title-wrapper {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
}

.behind-text {
  color: rgb(var(--color-red));
  font-size: .7rem;
  align-self: flex-end;
}

.behind-text.behind-warning {
  color: rgb(var(--color-orange));
}
</style>