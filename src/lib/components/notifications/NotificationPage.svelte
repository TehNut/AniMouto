<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { operationStore } from "@urql/svelte";
  import type { NotificationsResult } from "$lib/graphql";
  import { NotificationsQuery, NotificationType } from "$lib/graphql";
  import QueryContainer from "$lib/components/QueryContainer.svelte";
  import { ActivityNotification, MediaNotification, MediaMergeNotification, MediaDeletionNotification, ThreadNotification, UnknownNotification } from "$lib/components/notifications";

  export let page: number;

  const dispatch = createEventDispatcher();
  const notifications = operationStore<{ Page: NotificationsResult }>(NotificationsQuery, { 
    reset: false,
    page
  }, { requestPolicy: "network-only" });

  notifications.subscribe(r => {
    if (r.data && !r.data.Page.pageInfo.hasNextPage)
      dispatch("last-page")
  });

  function getNotificationComponent(notification: NotificationsResult["notifications"][0]) {
    switch (notification.type) {
      case NotificationType.ACTIVITY_LIKE: 
      case NotificationType.ACTIVITY_MENTION:
      case NotificationType.ACTIVITY_MESSAGE:
      case NotificationType.ACTIVITY_REPLY:
      case NotificationType.ACTIVITY_REPLY_LIKE:
      case NotificationType.ACTIVITY_REPLY_SUBSCRIBED:
      case NotificationType.FOLLOWING:
        return ActivityNotification;
      case NotificationType.AIRING:
      case NotificationType.RELATED_MEDIA_ADDITION:
      case NotificationType.MEDIA_DATA_CHANGE:
        return MediaNotification;
      case NotificationType.MEDIA_MERGE:
        return MediaMergeNotification;
      case NotificationType.MEDIA_DELETION:
        return MediaDeletionNotification;
      case NotificationType.THREAD_COMMENT_LIKE:
      case NotificationType.THREAD_COMMENT_MENTION:
      case NotificationType.THREAD_COMMENT_REPLY:
      case NotificationType.THREAD_LIKE:
      case NotificationType.THREAD_SUBSCRIBED:
        return ThreadNotification;
      default:
        return UnknownNotification;
    }
  }
</script>

<QueryContainer query={notifications}>
  <div class="flex flex-col space-y-2">
    {#each $notifications.data.Page.notifications as notification}
      <svelte:component this={getNotificationComponent(notification)} {notification} />
    {/each}
  </div>
</QueryContainer>