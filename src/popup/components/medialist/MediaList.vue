<template>
  <div>
    <div class="buttons">
      <i class="material-icons icon" @click="$refs.query.runQuery()">refresh</i>
    </div>

    <QueryContainer ref="query" :query="getMediaList" :responsifier="parseMediaList" error-text="I tried my best but couldn't find your list">
      <template scope="{response}">
        <div>
          <MediaGrid :list="response.airing" :title="{ url: 'https://anilist.co/airing', text: 'Airing' }">
            <span v-if="response.behindTime" style="color:rgb(var(--color-red));font-size:10px;">{{ response.behindTime }} behind</span>
          </MediaGrid>
          <MediaGrid :list="response.watching" :title="{ url: getUserUrl, urlFlavor: '/animelist', text: 'Anime in Progress' }"/>
          <MediaGrid :list="response.reading" :title="{ url: getUserUrl, urlFlavor: '/mangalist', text: 'Manga in Progress' }"/>
        </div>
      </template>
    </QueryContainer>

  </div>
</template>

<script>
  import {queryAL,formatTime} from "../../../assets/js/utils";
  import mediaList from "../../../assets/graphql/user_media_list.graphql";
  import MediaGrid from "./MediaGrid";
  import QueryContainer from "../base/QueryContainer";

  export default {
    name: "MediaList",
    components: {QueryContainer, MediaGrid},
    methods: {
      getMediaList() {
        return this.$browser.storage.local.get().then(value => {
          if (value.access_token === "" || value.user_info.id === -1)
            return;

          return queryAL(mediaList, { user: value.user_info.id }, value.access_token);
        });
      },
      parseMediaList(response) {
        const res = {
          airing: [],
          watching: [],
          reading: []
        };

        const data = response.data;
        if (data.anime.mediaList.length > 0) {
          data.anime.mediaList.forEach(e => {
            if (e.media.nextAiringEpisode)
              res.airing.push(e);
            else
              res.watching.push(e);
          });

          res.airing = res.airing.sort((o1, o2) => o1.media.nextAiringEpisode.timeUntilAiring - o2.media.nextAiringEpisode.timeUntilAiring);
          res.watching = res.watching.sort((o1, o2) => o2.updatedAt - o1.updatedAt);
          res.behindTime = this.calculateTimeBehind(res.airing);
        }

        if (data.manga.mediaList.length > 0) {
          data.manga.mediaList.forEach(e => res.reading.push(e));

          res.reading = res.reading.sort((o1, o2) => o2.updatedAt - o1.updatedAt);
        }

        return res;
      },
      async getUserUrl() {
        return await this.$browser.storage.local.get().then(value => value.user_info.site_url);
      },
      calculateTimeBehind(list) {
        let total = 0;
        list.forEach(e => {
          const behind = e.media.nextAiringEpisode.episode - 1 - e.progress;
          if (behind > 0)
            total += e.media.duration * behind;
        });

        return total <= 0 ? null : formatTime(total * 60);
      }
    }
  }
</script>

<style scoped>
  .buttons {
    position: absolute;
    right: 20px;
  }
</style>
