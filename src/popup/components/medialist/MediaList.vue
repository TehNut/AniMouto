<template>
  <div>
    <div class="buttons">
      <i class="material-icons icon" @click="$refs.query.runQuery()">refresh</i>
    </div>

    <QueryContainer ref="query" :query="getMediaList" :responsifier="parseMediaList" error-text="I tried my best but couldn't find your list">
      <template scope="{response}">
        <div>
          <MediaGrid :list="response.airing.list" :title="{ url: 'https://anilist.co/airing', text: 'Airing' }" @updateProgress="updateTimeBehind($event.diff, response.airing.behind)">
            <span v-if="response.airing.behind && response.airing.behind.count > 0" style="color:rgb(var(--color-red));font-size:10px;">{{ response.airing.behind.time.pretty }} behind ({{ response.airing.behind.count }} episodes)</span>
          </MediaGrid>
          <MediaGrid :list="response.watching.list" :title="{ url: getUserUrl, urlFlavor: '/animelist', text: 'Anime in Progress' }" @updateProgress="updateTimeBehind($event.diff, response.watching.behind)">
            <span v-if="response.watching.behind && response.watching.behind.count > 0" style="color:rgb(var(--color-orange));font-size:10px;">{{ response.watching.behind.time.pretty }} left ({{ response.watching.behind.count }} episodes)</span>
          </MediaGrid>
          <MediaGrid :list="response.reading.list" :title="{ url: getUserUrl, urlFlavor: '/mangalist', text: 'Manga in Progress' }"/>
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
          airing: {
            list: []
          },
          watching: {
            list: []
          },
          reading: {
            list: []
          }
        };

        const data = response.data;
        if (data.anime.mediaList.length > 0) {
          data.anime.mediaList.forEach(e => {
            if (e.media.nextAiringEpisode)
              res.airing.list.push(e);
            else
              res.watching.list.push(e);
          });

          res.airing.list = res.airing.list.sort((o1, o2) => o1.media.nextAiringEpisode.timeUntilAiring - o2.media.nextAiringEpisode.timeUntilAiring);
          res.airing.behind = this.calculateTimeBehind(res.airing.list);
          res.watching.behind = this.calculateTimeBehind(res.watching.list);
        }

        if (data.manga.mediaList.length > 0)
          data.manga.mediaList.forEach(e => res.reading.list.push(e));

        return res;
      },
      async getUserUrl() {
        return await this.$browser.storage.local.get().then(value => value.user_info.site_url);
      },
      calculateTimeBehind(list) {
        let total = 0;
        let count = 0;
        list.forEach(e => {
          const behind = (e.media.nextAiringEpisode ? e.media.nextAiringEpisode.episode - 1 : e.media.episodes) - e.progress;
          if (behind > 0) {
            count += behind;
            total += e.media.duration * behind;
          }
        });

        return total <= 0 ? null : { count, time: { value: total * 60, pretty: formatTime(total * 60) } };
      },
      updateTimeBehind(diff, behind) {
        behind.count -= diff.progress;
        behind.time.value -= diff.timeDiff * 60;
        behind.time.pretty = formatTime(behind.time.value)
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
