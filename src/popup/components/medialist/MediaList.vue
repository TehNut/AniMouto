<template>
  <div>
    <div class="buttons">
      <i class="material-icons icon" @click="loadList">refresh</i>
    </div>

    <transition name="fade">
      <Spinner v-if="loading"/>
    </transition>

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
        return (!entry.media.nextAiringEpisode && entry.media.episodes && entry.progress >= entry.media.episodes) || (entry.media.chapters && entry.progress >= entry.media.chapters);
      },
      loadList() {
        this.media.airing = [];
        this.media.watching = [];
        this.media.reading = [];

        const _self = this;
        this.$browser.storage.local.get({ access_token: "", user_info: { id: -1 } }).then(value => {
          if (value.access_token === "" || value.user_info.id === -1)
            return;

          queryAL(mediaList, { user: value.user_info.id }, value.access_token).then(res => res.data).then(res => {
            if (res.anime.mediaList.length > 0) {
              res.anime.mediaList.forEach(e => {
                if (e.media.nextAiringEpisode)
                  _self.media.airing.push(e);
                else
                  _self.media.watching.push(e);
              });

              _self.media.airing.sort((o1, o2) => o1.media.nextAiringEpisode.timeUntilAiring - o2.media.nextAiringEpisode.timeUntilAiring);
              _self.media.watching.sort((o1, o2) => o2.updatedAt - o1.updatedAt);
            }

            if (res.manga.mediaList.length > 0) {
              res.manga.mediaList.forEach(e => _self.media.reading.push(e));

              _self.media.reading.sort((o1, o2) => o2.updatedAt - o1.updatedAt);
            }
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
