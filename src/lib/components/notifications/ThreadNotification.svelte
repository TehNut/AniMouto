<script lang="ts">
  import type { ThreadFragment, UserFragment, ThreadLikeNotification, ThreadCommentLikeNotification, ThreadCommentReplyNotification, ThreadCommentMentionNotification, ThreadCommentSubscribedNotification } from "@anilist/graphql";
  import NotificationContainer from "./NotificationContainer.svelte";

  export let notification: Pick<ThreadLikeNotification | ThreadCommentLikeNotification | ThreadCommentReplyNotification | ThreadCommentMentionNotification | ThreadCommentSubscribedNotification, "createdAt" | "context"> & {
    commentId?: number,
    thread?: ThreadFragment,
    user?: UserFragment
  };
  export let unread = false;

  function getContentUrl(): string {
    if (notification.thread.url === "#")
      return "";

    if (notification.commentId)
      return `${notification.thread.url}/comment/${notification.commentId}`;

    return notification.thread.url;
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
    <span class="font-medium hover:text-accent transition-colors">
      {notification.thread.title}
    </span>
  </a>
</NotificationContainer>