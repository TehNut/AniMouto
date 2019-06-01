<template>
  <div>
    <div class="buttons">
      <i class="material-icons icon" @click="$refs.query.runQuery()">refresh</i>
    </div>

    <h1 class="section-title"><a href="https://anilist.co/notifications" target="_blank">Recent Notifications</a></h1>
    <QueryContainer ref="query" :query="getNotifications" :responsifier="parseNotifications" error-text="Oopsy doopsy! Looks like your notifications got misplaced!">
      <template scope="{response}">
        <div>
          <span v-for="notification in response.notifications">
            <Notification :notification="notification" :unread="notification.unread">
              <component :is="getNotificationType(notification)" :notification="notification"></component>
            </Notification>
          </span>
        </div>
      </template>
    </QueryContainer>

  </div>
</template>

<script>
  import {queryAL} from "../../../assets/js/utils";
  import notificationQuery from "../../../assets/graphql/notifications.graphql";
  import ActivityNotification from "./type/ActivityNotification";
  import AiringNotification from "./type/AiringNotification";
  import ThreadNotification from "./type/ThreadNotification";
  import UnknownNotification from "./type/UnknownNotification";
  import Notification from "./Notification";
  import QueryContainer from "../base/QueryContainer";

  const allNotifications = [
    "ACTIVITY_LIKE", "ACTIVITY_MENTION", "ACTIVITY_MESSAGE", "ACTIVITY_REPLY", "ACTIVITY_REPLY_LIKE", "ACTIVITY_REPLY_SUBSCRIBED", "AIRING", "FOLLOWING", "RELATED_MEDIA_ADDITION", "THREAD_COMMENT_LIKE", "THREAD_COMMENT_MENTION", "THREAD_COMMENT_REPLY", "THREAD_LIKE", "THREAD_SUBSCRIBED"
  ];
  const noLikeNotifications = allNotifications.filter(e => !e.endsWith("_LIKE"));
  
  export default {
    name: "Notifications",
    components: {
      QueryContainer, Notification, ThreadNotification, AiringNotification, ActivityNotification, UnknownNotification
    },
    methods: {
      getNotifications() {
        return this.$browser.storage.local.get().then(value => {
          if (value.access_token === "")
            return Promise.reject("Invalid token");

          return queryAL(notificationQuery, {amount: 25, reset: true, types: value.notifications.hideLikes ? noLikeNotifications : allNotifications}, value.access_token);
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
      },
      getNotificationType(notification) {
        // These are to be kept in the same order as the API for consistency
        switch (notification.type) {
          case "ACTIVITY_LIKE":
          case "ACTIVITY_MENTION":
          case "ACTIVITY_MESSAGE":
          case "ACTIVITY_REPLY":
          case "ACTIVITY_REPLY_LIKE":
          case "ACTIVITY_REPLY_SUBSCRIBED": return "ActivityNotification";
          case "AIRING":
          case "RELATED_MEDIA_ADDITION": return "AiringNotification";
          case "FOLLOWING": return "ActivityNotification";
          case "THREAD_COMMENT_LIKE":
          case "THREAD_COMMENT_MENTION":
          case "THREAD_COMMENT_REPLY":
          case "THREAD_LIKE":
          case "THREAD_SUBSCRIBED": return "ThreadNotification";
          default: return "UnknownNotification";
        }
      }
    },
    mounted() {
      this.$emit("update-notifications", 0);
    }
  }
</script>

<style scoped>
  .buttons {
    position: absolute;
    right: 20px;
  }
</style>
