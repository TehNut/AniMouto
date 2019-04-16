<template>
  <div>
    <div class="buttons">
      <i class="material-icons icon" @click="loadNotifications">refresh</i>
      <a href="https://anilist.co/notifications" target="_blank"><i class="material-icons icon">open_in_new</i></a>
      <i class="material-icons icon" @click="markRead">done_all</i>
    </div>
    <h1 class="section-title">Recent Notifications</h1>
    <transition name="fade">
      <Spinner v-if="notifications.length === 0"/>
    </transition>
    <div>
      <span v-for="notification in notifications">
        <Notification :notification="notification" :unread="notification.unread">
          <ActivityNotification v-if="notification.__typename.startsWith('Activity') || notification.__typename === 'FollowingNotification'" :notification="notification"/>
          <AiringNotification v-else-if="notification.__typename === 'AiringNotification'" :notification="notification"/>
          <ThreadNotification v-else-if="notification.__typename .startsWith('ThreadComment')" :notification="notification"/>
        </Notification>
      </span>
    </div>
  </div>
</template>

<script>
  import {queryAL} from "../../../assets/js/utils";
  import notificationQuery from "../../../assets/graphql/notifications.graphql";
  import Spinner from "../base/Spinner";
  import ActivityNotification from "./type/ActivityNotification";
  import AiringNotification from "./type/AiringNotification";
  import ThreadNotification from "./type/ThreadNotification";
  import Notification from "./Notification";

  export default {
    name: "Notifications",
    components: {Notification, ThreadNotification, AiringNotification, ActivityNotification, Spinner},
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
        chrome.storage.local.get({ access_token: "" }, value => {
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
      markRead() {
        this.$emit("update-notifications", 0);
        this.notifications.filter(n => n.unread).forEach(n => n.unread = false);
      }
    },
    created() {
      this.loadNotifications();
    }
  }
</script>

<style scoped>
  .buttons {
    position: absolute;
    right: 20px;
  }
</style>
