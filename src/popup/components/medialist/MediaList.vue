<template>
  <div>
    <transition name="fade">
      <RatingModal v-if="ratingMedia" :media="ratingMedia.media" :listId="ratingMedia.id" @clearRating="ratingMedia = null"/>
    </transition>

    <div class="buttons">
      <div v-if="starred && starred.length > 0" class="switcher">
        <span :class="'switcher-option no-select ' + (listType === 'DEFAULT' ? 'selected' : '')" style="cursor:pointer" @click="changeList('DEFAULT')">Default</span>
        <span :class="'switcher-option no-select ' + (listType !== 'DEFAULT' ? 'selected' : '')" style="cursor:pointer" @click="changeList('STARRED')">Starred</span>
      </div>
      <i class="material-icons icon" @click="$refs.query.runQuery()">refresh</i>
    </div>

    <QueryContainer ref="query" :query="getMediaList" :responsifier="parseMediaList" error-text="I tried my best but couldn't find your list">
      <div slot-scope="{response}">
        <MediaGrid :list="response.airing.list" :title="{ url: 'https://anilist.co/airing', text: 'Airing' }" @updateProgress="updateProgress($event, response, 'airing')">
          <span v-if="response.airing.behind && response.airing.behind.count > 0" style="color:rgb(var(--color-red));font-size:10px;">{{ response.airing.behind.time.pretty }} behind ({{ response.airing.behind.count }} episodes)</span>
        </MediaGrid>
        <MediaGrid :list="response.watching.list" :title="{ url: getUserUrl, urlFlavor: '/animelist', text: getSectionTitle('Anime', 'in Progress') }" :ignoreComplete="listType === 'STARRED'" @updateProgress="updateProgress($event, response, 'watching')">
          <span v-if="response.watching.behind && response.watching.behind.count > 0" style="color:rgb(var(--color-orange));font-size:10px;">{{ response.watching.behind.time.pretty }} left ({{ response.watching.behind.count }} episodes)</span>
        </MediaGrid>
        <MediaGrid :list="response.reading.list" :title="{ url: getUserUrl, urlFlavor: '/mangalist', text: getSectionTitle('Manga', 'in Progress') }" :ignoreComplete="listType === 'STARRED'" @updateProgress="updateProgress($event, response, 'reading')"/>
      </div>
    </QueryContainer>

  </div>
</template>

<script>
  import {queryAL,formatTime} from "../../../assets/js/utils";
  import mediaList from "../../../assets/graphql/user_media_list.graphql";
  import MediaGrid from "./MediaGrid";
  import QueryContainer from "../base/QueryContainer";
  import RatingModal from "./rating/RatingModal";

  export default {
    name: "MediaList",
    components: {RatingModal, QueryContainer, MediaGrid},
    data() {
      return {
        ratingMedia: null,
        starred: [],
        listType: "DEFAULT"
      }
    },
    methods: {
      getMediaList() {
        return this.$browser.storage.local.get().then(value => {
          if (value.access_token === "" || value.user_info.id === -1)
            return;

          const options = { user: value.user_info.id };
          if (this.starred.length > 0 && this.listType !== "DEFAULT") {
            options.starred = this.starred;
          } else {
            options.status = [ "CURRENT", "REPEATING" ]
          }
          return queryAL(mediaList, options, value.access_token);
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
            if ((e.media.nextAiringEpisode || e.media.status === "RELEASING") && this.listType === "DEFAULT")
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
      updateProgress(event, response, list) {
        this.updateTimeBehind(event.diff, response[list].behind);
        this.$browser.storage.local.get().then(v => {
          if (v.rateAfterComplete) {
            const entry = response[list].list.find(e => e.media.id === event.id);
            const total = entry.media.episodes || entry.media.chapters || null;
            if (total && event.newProgress >= total)
              this.ratingMedia = response[list].list.find(e => e.media.id === event.id);
          }
        });
      },
      updateTimeBehind(diff, behind) {
        if (!behind)
          return;

        behind.count -= diff.progress;
        behind.time.value -= diff.timeDiff * 60;
        behind.time.pretty = formatTime(behind.time.value)
      },
      changeList(list) {
        this.listType = list;
        this.$refs.query.runQuery();
      },
      getSectionTitle(type, context) {
        return type + (this.listType === "DEFAULT" ? " " + context : "");
      }
    },
    activated() {
      this.$browser.storage.local.get().then(v => {
        this.starred = v.starred || [];
        if (this.starred.length === 0 && this.listType === "STARRED")
          this.changeList("DEFAULT");
      });
    }
  }
</script>

<style scoped>
  .buttons {
    position: absolute;
    right: 20px;
    display: flex;
    align-items: center;
  }

  .switcher {
    margin-right: 10px;
    font-size: smaller;
    background-color: rgb(var(--color-foreground));
    display: flex;
    justify-content: space-around;
    border-radius: 3px;
    width: 110px;
    text-align: center;
  }

  .switcher-option {
    width: 50%;
    padding: 3px;
    background-color: rgb(var(--color-foreground));
    transition: .2s;
    border-radius: 3px;
  }

  .selected {
    background-color: rgb(var(--color-foreground-blue));
  }
</style>
