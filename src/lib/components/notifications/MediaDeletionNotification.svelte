<script lang="ts">
  import Icon from "svelte-fa";
  import { faTrash } from "@fortawesome/free-solid-svg-icons";
  import type { MediaDeletionNotification } from "@anilist/graphql";
  import NotificationContainer from "./NotificationContainer.svelte";

  export let notification: MediaDeletionNotification;
  export let unread = false;
</script>

<NotificationContainer {unread} createdAt={notification.createdAt}>
  <Icon icon={faTrash} class="flex-none w-12 text-3xl mr-4 aspect-square text-orange" />
  <div class="line-clamp-3 mr-6 flex-1">
    <span class="font-medium">{notification.deletedMediaTitle}</span>
    {notification.context}
  </div>
</NotificationContainer>