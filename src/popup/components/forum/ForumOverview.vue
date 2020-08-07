<template>
  <div>
    <div class="buttons">
      <i class="material-icons icon" @click="$refs.query.runQuery()">refresh</i>
    </div>
    <h1 class="section-title"><a href="https://anilist.co/forum/overview" target="_blank">{{ $t("forum.title") }}</a></h1>
    <QueryContainer ref="query" :query="getForum" :responsifier="res => res.data.Page.threads" :error-text="$t('forum.query_fail')">
      <div slot-scope="{response}">
        <span v-for="thread in response">
          <Thread :thread="thread"/>
        </span>
      </div>
    </QueryContainer>
  </div>
</template>

<script>
  import {queryAL} from "../../../assets/js/utils";
  import forumQuery from "../../../assets/graphql/forum_activity.graphql";
  import Thread from "./Thread";
  import QueryContainer from "../base/QueryContainer";

  export default {
    name: "ForumOverview",
    components: {QueryContainer, Thread},
    methods: {
      getForum() {
        return this.$browser.storage.local.get({ access_token: "" }).then(value => {
          if (value.access_token === "")
            return Promise.reject("Invalid token");

          return queryAL(forumQuery, {}, value.access_token);
        });
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
