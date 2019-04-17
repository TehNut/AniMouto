<template>
  <div>
    <transition name="fade">
      <Spinner v-if="loading"/>
    </transition>
    <div class="buttons" v-if="!loading">
      <i class="material-icons icon" @click="loadList">refresh</i>
    </div>

    <MediaGrid :list="media.airing" :title="{ url: 'https://anilist.co/airing', text: 'Airing' }"/>
    <MediaGrid :list="media.watching" :title="'Anime in Progress'"/>
    <MediaGrid :list="media.reading" :title="'Manga in Progress'"/>
  </div>
</template>

<script>
  import {queryAL} from "../../../assets/js/utils";
  import mediaList from "../../../assets/graphql/user_media_list.graphql";
  import Spinner from "../base/Spinner";
  import MediaGrid from "./MediaGrid";

  export default {
    name: "MediaList",
    components: {MediaGrid, Spinner},
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
      isComplete(entry) {
        return (entry.media.episodes && entry.progress >= entry.media.episodes) || (entry.media.chapters && entry.progress >= entry.media.chapters);
      },
      loadList() {
        this.media.airing = [];
        this.media.watching = [];
        this.media.reading = [];

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
    },
    computed: {
      loading() {
        return this.media.airing.length === 0 && this.media.watching.length === 0 && this.media.reading.length === 0;
      }
    },
    created() {
      this.loadList();
    }
  }
</script>

<style scoped>
  .buttons {
    position: absolute;
    right: 20px;
  }
</style>
