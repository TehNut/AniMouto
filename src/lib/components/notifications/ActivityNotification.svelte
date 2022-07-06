<script lang="ts">
  import { format } from "timeago.js";
  import type { UserFragment, UserAvatar, ActivityFragment, ActivityLikeNotification, ActivityMentionNotification, ActivityMessageNotification, ActivityReplyNotification, ActivityReplyLikeNotification, ActivityReplySubscribedNotification, FollowingNotification } from "@anilist/graphql";

  export let notification: Pick<ActivityLikeNotification | ActivityMentionNotification | ActivityMessageNotification | ActivityReplyNotification | ActivityReplyLikeNotification | ActivityReplySubscribedNotification | FollowingNotification, "context" | "createdAt"> & {
    user?: Pick<UserFragment, "name" | "url"> & {
      img: Pick<UserAvatar, "large">
    },
    activityId?: number,
    activity?: Pick<ActivityFragment, "url">
  };
  export let unread = false;

  const creationDate = new Date(notification.createdAt * 1000);
  let displayDate = format(creationDate);
  displayDate = displayDate.substring(0, displayDate.indexOf(" ") + 2).replace(" ", ""); 

  function getContentUrl(): string {
    if (notification.activity)
      return notification.activity.url;

    if (notification.activityId)
      return `https://anilist.co/activity/${notification.activityId}`;

    return notification.user.url;
  }
</script>

<div class="relative p-2 flex items-center bg-foreground rounded-md border-r-4 { unread ? "border-r-accent" : "border-r-transparent" }">
  <a href={notification.user.url} target="_blank" class="flex-none">
    <img src={notification.user.img.large} alt="User profile" class="w-12 mr-4 object-center object-cover aspect-square rounded-full" />
    <!-- Merged -->
  </a>
  <a href={getContentUrl()} target="_blank" class="line-clamp-3 mr-6 flex-1">
    <a href={notification.user.url} target="_blank" class="font-medium hover:text-accent transition-colors">{notification.user.name}</a>
    {notification.context}
  </a>
  <time class="absolute top-1 right-2 text-xs" datetime={creationDate.toISOString()} title={creationDate.toLocaleString()}>
    {displayDate}
  </time>
</div>