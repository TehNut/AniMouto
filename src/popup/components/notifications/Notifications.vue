<template>
  <div>
    <div class="buttons">
      <i class="material-icons icon" @click="loadNotifications">refresh</i>
    </div>
    <h1 class="section-title"><a href="https://anilist.co/notifications" target="_blank">Recent Notifications</a></h1>
    <transition name="fade">
      <Spinner v-if="notifications.length === 0"/>
    </transition>

    <span v-for="notification in notifications">
      <Notification :notification="notification" :unread="notification.unread">
        <component :is="getNotificationType(notification)" :notification="notification"></component>
      </Notification>
    </span>
  </div>
</template>

<script>
  import {queryAL} from "../../../assets/js/utils";
  import notificationQuery from "../../../assets/graphql/notifications.graphql";
  import Spinner from "../base/Spinner";
  import ActivityNotification from "./type/ActivityNotification";
  import AiringNotification from "./type/AiringNotification";
  import ThreadNotification from "./type/ThreadNotification";
  import UnknownNotification from "./type/UnknownNotification";
  import Notification from "./Notification";

  export default {
    name: "Notifications",
    components: {Notification, ThreadNotification, AiringNotification, ActivityNotification, UnknownNotification, Spinner},
    data() {
      return {
        notifications: [],
        unreadCount: -1
      }
    },
    methods: {
      loadNotifications() {
        const _self = this;
        this.notifications = [];
        this.$browser.storage.local.get({ access_token: "" }).then(value => {
          if (value.access_token === "")
            return;

          queryAL(notificationQuery, { amount: 25, reset: true }, value.access_token).then(res => {
            _self.notifications = res.data.Page.notifications;
            _self.unreadCount = res.data.Viewer.unreadNotificationCount;

            for (let i = 0; i < _self.unreadCount; i++)
              _self.notifications[i].unread = true;
          });
        });
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
    created() {
      this.loadNotifications();
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
