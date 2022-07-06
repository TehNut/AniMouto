<script lang="ts">
  import Icon from "svelte-fa";
  import { faTrash } from "@fortawesome/free-solid-svg-icons";
  import { format } from "timeago.js";
  import type { MediaDeletionNotification } from "@anilist/graphql";

  export let notification: MediaDeletionNotification;
  export let unread = false;

  const creationDate = new Date(notification.createdAt * 1000);
  let displayDate = format(creationDate);
  displayDate = displayDate.substring(0, displayDate.indexOf(" ") + 2).replace(" ", ""); 
</script>

<div 
  class="relative p-2 flex items-center bg-foreground rounded-md border-r-4 { unread ? "border-r-accent" : "border-r-transparent" }"
>
  <Icon icon={faTrash} class="flex-none w-12 text-3xl mr-4 aspect-square text-orange" />
  <div class="line-clamp-3 mr-6 flex-1">
    <span class="font-medium">{notification.deletedMediaTitle}</span>
    {notification.context}
  </div>
  <time class="absolute top-1 right-2 text-xs" datetime={creationDate.toISOString()} title={creationDate.toLocaleString()}>
    {displayDate}
  </time>
</div>