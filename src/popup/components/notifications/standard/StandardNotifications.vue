<template>
  <div>
    <span v-for="notification in notifications">
      <Notification :notification="notification" :unread="notification.unread">
        <component :is="getNotificationType(notification)" :notification="notification"></component>
      </Notification>
    </span>
  </div>
</template>

<script>
  import Notification from "./Notification";
  import ActivityNotification from "./type/ActivityNotification";
  import AiringNotification from "./type/AiringNotification";
  import ThreadNotification from "./type/ThreadNotification";
  import UnknownNotification from "../common/type/UnknownNotification";

  export default {
    name: "StandardNotifications",
    components: {Notification, ThreadNotification, AiringNotification, ActivityNotification, UnknownNotification},
    props: [
      "notifications"
    ],
    methods: {
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
    }
  }
</script>

<style scoped>

</style>
