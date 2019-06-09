<template>
  <div>
    <div class="buttons">
      <i class="material-icons icon" @click="$refs.query.runQuery()">refresh</i>
    </div>

    <QueryContainer ref="query" :query="getMediaList" :responsifier="parseMediaList" error-text="I tried my best but couldn't find your list">
      <template scope="{response}">
        <div>
          <MediaGrid :list="response.airing" :title="{ url: 'https://anilist.co/airing', text: 'Airing' }"/>
          <MediaGrid :list="response.watching" :title="{ url: getUserUrl, urlFlavor: '/animelist', text: 'Anime in Progress' }"/>
          <MediaGrid :list="response.reading" :title="{ url: getUserUrl, urlFlavor: '/mangalist', text: 'Manga in Progress' }"/>
        </div>
      </template>
    </QueryContainer>

  </div>
</template>

<script>
  import {queryAL} from "../../../assets/js/utils";
  import mediaList from "../../../assets/graphql/user_media_list.graphql";
  import MediaGrid from "./MediaGrid";
  import QueryContainer from "../base/QueryContainer";

  export default {
    name: "MediaList",
    components: {QueryContainer, MediaGrid},
    data() {
      return {
        media: {
          airing: [],
          watching: [],
          reading: []
        }
      }
    },
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

          res.airing.sort((o1, o2) => o1.media.nextAiringEpisode.timeUntilAiring - o2.media.nextAiringEpisode.timeUntilAiring);
          res.watching.sort((o1, o2) => o2.updatedAt - o1.updatedAt);
        }

        if (data.manga.mediaList.length > 0) {
          data.manga.mediaList.forEach(e => res.reading.push(e));

          res.reading.sort((o1, o2) => o2.updatedAt - o1.updatedAt);
        }

        return res;
      },
      async getUserUrl() {
        return await this.$browser.storage.local.get().then(value => value.user_info.site_url);
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
