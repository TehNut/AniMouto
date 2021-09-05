<template>
  <div class="notification-wrapper" :class="{ unread: unread }" @click="unread = false">
    <!-- Activity-based -->
    <div v-if="innerType === 'ACTIVITY'" class="notification-body">
      <a class="cover" :href="notification.user.url" target="_blank">
        <img
          :src="notification.user.img.large" 
          :alt="notification.user.name"
        >
        <!-- TODO additional user count from merge -->
      </a>
      <a :href="getActivityUrl()" target="_blank" class="context">
        <i18n :path="`notifications.${type.toLowerCase()}`">
          <a place="user" :href="notification.user.url" target="_blank">{{ notification.user.name }}</a>
          <!-- TODO Alternatively, show additional users as i18n list -->
        </i18n>
      </a>
    </div>
    <!-- Media-based -->
    <div v-else-if="innerType === 'MEDIA'" class="notification-body">
      <a class="cover" :href="notification.media.url" target="_blank">
        <img
          :src="notification.media.img.large" 
          :alt="notification.media.title.userPreferred"
        >
      </a>
      <i18n :path="`notifications.${type.toLowerCase()}`" class="context" tag="span" :places="{ episode: notification.episode }">
        <a place="media" :href="notification.media.url" target="_blank">{{ notification.media.title.userPreferred }}</a>
      </i18n>
    </div>
    <!-- Media merged -->
    <div v-else-if="innerType === 'MEDIA_MERGE'" class="notification-body">
      <a class="cover" :href="notification.media.url" target="_blank">
        <img
          :src="notification.media.img.large" 
          :alt="notification.media.title.userPreferred"
        >
      </a>
      <i18n :path="`notifications.${type.toLowerCase()}`" class="context" tag="span" :places="{ merged: notification.deletedMediaTitle }">
        <a place="media" :href="notification.media.url" target="_blank">{{ notification.media.title.userPreferred }}</a>
      </i18n>
    </div>
    <!-- Media deleted -->
    <div v-else-if="innerType === 'MEDIA_DELETED'" class="notification-body">
      <span class="cover">
        <fa-icon icon="trash" />
      </span>
      <span class="context">
        {{ $t(`notifications.${type.toLowerCase()}`, { deleted: notification.deletedMediaTitles.join(", ") }) }}
      </span>
    </div>
    <!-- Thread-based -->
    <div v-else-if="innerType === 'THREAD'" class="notification-body">
      <a class="cover" :href="notification.user.url" target="_blank">
        <img
          :src="notification.user.img.large" 
          :alt="notification.user.name"
        >
        <!-- TODO additional user count from merge -->
      </a>
      <i18n :path="`notifications.${type.toLowerCase()}`" class="context" tag="span" :places="{ episode: notification.episode }">
          <!-- TODO Alternatively, show additional users as i18n list -->
        <a place="user" :href="notification.user.url" target="_blank">{{ notification.user.name }}</a>
        <a place="thread" :href="getThreadUrl()" target="_blank" @click="e => getThreadUrl() === '#' && e.preventDefault()">{{ notification.thread.title }}</a>
      </i18n>
    </div>
    <!-- Unknown -->
    <div v-else class="notification-body">
      <a class="cover" href="https://github.com/TehNut/AniMouto" target="_blank">
        <fa-icon icon="exclamation-circle" />
      </a>
      <span class="context">{{ $t("notifications.unknown_type") }}</span>
    </div>
    <span class="time" :title="new Date(notification.createdAt * 1000).toLocaleString()">{{ $t("notifications.time_since", { time: getTimeSince() }) }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Notification, NotificationType } from "@/models/Notifcation";
import { parseSeconds, readableTime } from "@/Utils";

type InnerType = "ACTIVITY" | "MEDIA" | "THREAD" | "MEDIA_MERGE" | "MEDIA_DELETION" | "UNKNOWN";
function getInnerType(type: NotificationType): InnerType {
  switch (type) {
    case NotificationType.ACTIVITY_LIKE: 
    case NotificationType.ACTIVITY_MENTION:
    case NotificationType.ACTIVITY_MESSAGE:
    case NotificationType.ACTIVITY_REPLY:
    case NotificationType.ACTIVITY_REPLY_LIKE:
    case NotificationType.ACTIVITY_REPLY_SUBSCRIBED:
    case NotificationType.FOLLOWING:
      return "ACTIVITY";
    case NotificationType.AIRING:
    case NotificationType.RELATED_MEDIA_ADDITION:
    case NotificationType.MEDIA_DATA_CHANGE:
      return "MEDIA";
    case NotificationType.MEDIA_MERGE:
      return "MEDIA_MERGE";
    case NotificationType.MEDIA_DELETION:
      return "MEDIA_DELETION"
    case NotificationType.THREAD_COMMENT_LIKE:
    case NotificationType.THREAD_COMMENT_MENTION:
    case NotificationType.THREAD_COMMENT_REPLY:
    case NotificationType.THREAD_LIKE:
    case NotificationType.THREAD_SUBSCRIBED:
      return "THREAD";
    default:
      return "UNKNOWN";
  }
}

@Component
export default class Error extends Vue {
  @Prop({ required: true })
  type!: NotificationType;

  @Prop()
  unread!: boolean;

  @Prop({ required: true })
  notification!: Notification;

  innerType: InnerType = getInnerType(this.type);

  getActivityUrl() {
    if (this.notification.activity)
      return this.notification.activity.url;

    if (this.notification.activityId)
      return `https://anilist.co/activity/${this.notification.activityId}`;

    return this.notification.user!.url;
  }

  getThreadUrl() {
    if (this.notification.thread!.url === "#")
      return "";

    if (this.notification.commentId)
      return `${this.notification.thread!.url}/comment/${this.notification.commentId}`;

    return this.notification.thread!.url;
  }

  getTimeSince() {
    return readableTime(parseSeconds(Math.floor(Date.now() / 1000) - this.notification.createdAt)).split(" ")[0];
  }
}
</script>

<style scoped>
.notification-wrapper {
  background: rgb(var(--color-foreground));
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
  position: relative;
  border-right: 4px solid transparent;
}

.unread {
  border-right: 4px solid rgb(var(--color-accent));
}

.notification-body {
  display: flex;
  flex-flow: row;
  align-items: center;
}

.cover {
  width: 50px;
  min-width: 50px;
  height: 75px;
}

.cover img {
  height: 100%;
  width: 100%;
  border-radius: 4px;
  object-fit: cover;
}

.cover svg {
  height: 90%;
  width: 90%;
  color: rgb(var(--color-red));
  padding-left: 10%;
  padding-top: 10%;
}

.context {
  font-size: 0.9rem;
  padding: 0 20px;
}

.context span {
  color: rgb(var(--color-text));
}

.time {
  position: absolute;
  font-size: 0.65rem;
  top: 10px;
  right: 6px;
}
</style>