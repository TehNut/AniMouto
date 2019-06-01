<template>
  <div>
    <div class="buttons">
      <i class="material-icons icon" @click="$refs.query.runQuery()">refresh</i>
    </div>

    <h1 class="section-title"><a href="https://anilist.co/notifications" target="_blank">Recent Notifications</a></h1>
    <QueryContainer ref="query" :query="getNotifications" :responsifier="parseNotifications" error-text="Oopsy doopsy! Looks like your notifications got misplaced!">
      <template scope="{response}">
        <component :is="style" :notifications="response.notifications"/>
      </template>
    </QueryContainer>
  </div>
</template>

<script>
  import {queryAL} from "../../../assets/js/utils";
  import notificationQuery from "../../../assets/graphql/notifications.graphql";
  import StandardNotifications from "./standard/StandardNotifications";
  import CondensedNotifications from "./condensed/CondensedNotifications";
  import QueryContainer from "../base/QueryContainer";

  export default {
    name: "Notifications",
    components: {
      QueryContainer, StandardNotifications, CondensedNotifications
    },
    data() {
      return {
        style: "StandardNotifications"
      }
    },
    methods: {
      getNotifications() {
        return this.$browser.storage.local.get({ access_token: "" }).then(value => {
          if (value.access_token === "")
            return Promise.reject("Invalid token");

          return queryAL(notificationQuery, {amount: 25, reset: true}, value.access_token);
        });
      },
      parseNotifications(response) {
        const res = {
          notifications: response.data.Page.notifications,
          unreadCount: response.data.Viewer.unreadNotificationCount
        };

        for (let i = 0; i < res.unreadCount; i++)
          res.notifications[i].unread = true;

        return res;
      }
    },
    mounted() {
      this.$emit("update-notifications", 0);
      this.$browser.storage.local.get().then(res => {
        this.style = res.notifications.condense ? "CondensedNotifications" : "StandardNotifications";
      });
    }
  }
</script>

<style scoped>
  .buttons {
    position: absolute;
    right: 20px;
  }
</style>
