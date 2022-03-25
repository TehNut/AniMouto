<script lang="ts">
  import Icon from "svelte-fa";
  import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
  import { format } from "timeago.js";
  import type { NotificationsResult } from "$lib/graphql";

  export let notification: NotificationsResult["notifications"][0];
  export let unread = false;

  const creationDate = new Date(notification.createdAt * 1000);
  let displayDate = format(creationDate);
  displayDate = displayDate.substring(0, displayDate.indexOf(" ") + 2).replace(" ", ""); 

  function getContentUrl(): string {
    if (notification.thread.url === "#")
      return "";

    if (notification.commentId)
      return `${notification.thread.url}/comment/${notification.commentId}`;

    return notification.thread.url;
  }
</script>

<div class="relative p-2 flex items-center bg-foreground rounded-md border-r-4 { unread ? "border-r-accent" : "border-r-transparent" }">
  <Icon icon={faInfoCircle} class="flex-none w-12 text-3xl mr-4 aspect-square text-yellow" />
  <span class="line-clamp-3 mr-6 flex-1">
    {notification.type}
    is an unknown notification type. Please 
    <a href="https://github.com/TehNut/AniMouto" target="_blank" class="text-accent">report this</a>
    so it can be supported!
  </span>
  <time class="absolute top-1 right-2 text-xs" datetime={creationDate.toISOString()} title={creationDate.toLocaleString()}>
    {displayDate}
  </time>
</div>