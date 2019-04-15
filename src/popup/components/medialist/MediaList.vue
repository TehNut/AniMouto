<template>
  <div>
    <span v-if="media.airing.length > 0">
      <h1 class="section-title">
        <a href="https://anilist.co/airing" target="_blank">Airing</a>
      </h1>
      <div class="section media-grid">
        <MediaCard v-for="anime in media.airing" :entry="anime"/>
      </div>
    </span>
    <span v-if="media.watching.length > 0">
      <h1 class="section-title">Anime in Progress</h1>
      <div class="section media-grid">
        <MediaCard v-for="anime in media.watching" :entry="anime"/>
      </div>
    </span>
    <span v-if="media.reading.length > 0">
      <h1 class="section-title">Manga in Progress</h1>
      <div class="section media-grid">
        <MediaCard v-for="anime in media.reading" :entry="anime"/>
      </div>
    </span>
  </div>
</template>

<script>
  import {queryAL} from "../../../assets/js/utils";
  import mediaList from "../../../assets/graphql/user_media_list.graphql";
  import MediaCard from "./MediaCard";

  export default {
    name: "MediaList",
    components: {MediaCard},
    data() {
      return {
        media: {
          airing: [],
          watching: [],
          reading: []
        }
      }
    },
    created() {
      const _self = this;
      chrome.storage.local.get({ access_token: "", user_info: { id: -1 } }, value => {
        if (value.access_token === "" || value.user_info.id === -1)
          return;

        queryAL(mediaList, { user: value.user_info.id }, value.access_token).then(res => res.data).then(res => {
          let animeEntries = res.anime.lists[0].entries;
          if (res.anime.lists.length > 1)
            animeEntries = animeEntries.concat(res.anime.lists[1].entries);

          animeEntries.forEach(e => {
            if (e.media.nextAiringEpisode)
              _self.media.airing.push(e);
            else
              _self.media.watching.push(e);
          });

          _self.media.airing.sort((o1, o2) => o1.media.nextAiringEpisode.timeUntilAiring - o2.media.nextAiringEpisode.timeUntilAiring);
          _self.media.watching.sort((o1, o2) => o2.updatedAt - o1.updatedAt);

          let mangaEntries = res.manga.lists[0].entries;
          if (res.manga.lists.length > 1)
            mangaEntries = mangaEntries.concat(res.manga.lists[1].entries);

          mangaEntries.forEach(e => _self.media.reading.push(e));

          _self.media.reading.sort((o1, o2) => o2.updatedAt - o1.updatedAt);
        });
      });
    }
  }
</script>

<style scoped>
  .media-grid {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fill, 85px);
    grid-template-rows: repeat(auto-fill, 115px);
    margin-bottom: 25px;
  }
</style>
