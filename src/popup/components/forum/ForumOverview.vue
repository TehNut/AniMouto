<template>
  <div>
    <div class="buttons">
      <i class="material-icons icon" @click="loadForum">refresh</i>
    </div>
    <h1 class="section-title"><a href="https://anilist.co/forum/overview" target="_blank">Recent Forum Activity</a></h1>
    <transition name="fade">
      <Spinner v-if="threads.length === 0"/>
    </transition>
    <span v-for="thread in threads">
        <Thread :thread="thread"/>
      </span>
  </div>
</template>

<script>
  import {queryAL} from "../../../assets/js/utils";
  import forumQuery from "../../../assets/graphql/forum_activity.graphql";
  import Spinner from "../base/Spinner";
  import Thread from "./Thread";

  export default {
    name: "ForumOverview",
    components: {Thread, Spinner},
    data() {
      return {
        threads: []
      }
    },
    methods: {
      loadForum() {
        const _self = this;
        this.threads = [];
        this.$browser.storage.local.get({ access_token: "" }).then(value => {
          if (value.access_token === "")
            return;

          queryAL(forumQuery, {}, value.access_token).then(res => {
            _self.threads = res.data.Page.threads;
          });
        });
      }
    },
    created() {
      this.loadForum();
    }
  }
</script>

<style scoped>
  .buttons {
    position: absolute;
    right: 20px;
  }
</style>
