<script lang="ts">
  import type { UserFragment, UserAvatar, ActivityFragment, ActivityLikeNotification, ActivityMentionNotification, ActivityMessageNotification, ActivityReplyNotification, ActivityReplyLikeNotification, ActivityReplySubscribedNotification, FollowingNotification } from "@anilist/graphql";
  import NotificationContainer from "./NotificationContainer.svelte";

  export let notification: Pick<ActivityLikeNotification | ActivityMentionNotification | ActivityMessageNotification | ActivityReplyNotification | ActivityReplyLikeNotification | ActivityReplySubscribedNotification | FollowingNotification, "context" | "createdAt"> & {
    user?: Pick<UserFragment, "name" | "url"> & {
      img: Pick<UserAvatar, "large">
    },
    activityId?: number,
    activity?: Pick<ActivityFragment, "url">
  };
  export let unread = false;

  function getContentUrl(): string {
    if (notification.activity)
      return notification.activity.url;

    if (notification.activityId)
      return `https://anilist.co/activity/${notification.activityId}`;

    return notification.user.url;
  }
</script>

<NotificationContainer {unread} createdAt={notification.createdAt}>
  <a href={notification.user.url} target="_blank" class="flex-none">
    <img src={notification.user.img.large} alt="User profile" class="w-12 mr-4 object-center object-cover aspect-square rounded-full" />
    <!-- Merged -->
  </a>
  <a href={getContentUrl()} target="_blank" class="line-clamp-3 mr-6 flex-1">
    <a href={notification.user.url} target="_blank" class="font-medium hover:text-accent transition-colors">{notification.user.name}</a>
    {notification.context}
  </a>
</NotificationContainer>