<template>
  <div>
    <div class="buttons">
      <i class="material-icons icon" @click="$refs.query.runQuery()">refresh</i>
    </div>

    <h1 class="section-title"><a href="https://anilist.co/notifications" target="_blank">Recent Notifications</a></h1>
    <QueryContainer ref="query" :query="getNotifications" :responsifier="parseNotifications" error-text="Oopsy doopsy! Looks like your notifications got misplaced!">
      <div slot-scope="{response}">
        <span v-for="notification in response.notifications">
          <Notification :notification="notification" :unread="notification.unread">
            <component :is="getNotificationType(notification)" :notification="notification"></component>
          </Notification>
        </span>
      </div>
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

          // Request 50 if we're hiding likes so we can have closer to 25 after filtering them out
          return queryAL(notificationQuery, {amount: value.notifications && value.notifications.hideLikes ? 50 : 25, reset: true}, value.access_token);
        });
      },
      async parseNotifications(response) {
        const config = await this.$browser.storage.local.get();
        const res = {
          notifications: response.data.Page.notifications,
          unreadCount: response.data.Viewer.unreadNotificationCount
        };

        for (let i = 0; i < res.unreadCount && i < res.notifications.length; i++)
          res.notifications[i].unread = true;

        if (config.notifications && config.notifications.hideLikes)
          res.notifications = res.notifications.filter(e => !e.type.endsWith("_LIKE")).splice(0, 25);

        // Condense after setting the unread status so we can carry it over later
        const shouldCondense = await this.$browser.storage.local.get().then(value => {
          return value.notifications && value.notifications.condenseNotifications;
        });

        if (shouldCondense)
          res.notifications = condense(res.notifications);

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

  const condensables = [
    "ACTIVITY_LIKE",
    "ACTIVITY_REPLY_LIKE",
    "FOLLOWING",
    "THREAD_COMMENT_LIKE",
    "THREAD_LIKE",
  ];
  const timeThreshold = 60 * 60 * 12; // 12 hours, matches activity condensing

  function condense(notifications) {
    const internal = [];
    notifications.forEach(notification => {
      // Make sure this notification is one that we support condensing of
      if (condensables.includes(notification.type)) {
        // Find a notification we've already checked that matches the new one in some way. Also make sure they're within the time threshold
        const condensed = internal.filter(n => n.type === notification.type).filter(n => {
          switch (notification.type) {
            case "ACTIVITY_LIKE":
            case "ACTIVITY_REPLY_LIKE": return n.activityId === notification.activityId;
            case "FOLLOWING": return true;
            case "THREAD_COMMENT_LIKE": return n.commentId === notification.commentId;
            case "THREAD_LIKE": return n.thread.id === notification.thread.id;
          }

          return false;
        }).find(n => Math.abs(n.createdAt - notification.createdAt) <= timeThreshold);

        // If there isn't already a notification related to this one, create the users array and push it to the master notification list
        if (!condensed) {
          notification.users = [ notification.user ];
          // delete notification.user;
          internal.push(notification);
          return;
        }

        // Push just the user of the new notification to the existing one
        condensed.users.push(notification.user);

        // Carry over the unread status if needed
        if (notification.unread)
          condensed.unread = true;
      } else {
        // We don't want to condense this, so just push it as is
        internal.push(notification);
      }
    });

    return internal;
  }
</script>

<style scoped>
  .buttons {
    position: absolute;
    right: 20px;
  }
</style>
