<script lang="ts">
  import { link } from "svelte-spa-router";
  import { format } from "timeago.js";
  import type { NotificationsResult } from "$lib/graphql";
  import { NotificationType } from "$lib/graphql";
  import { hexToRgb } from "$lib/util";

  export let notification: NotificationsResult["notifications"][0];
  export let unread = false;

  const creationDate = new Date(notification.createdAt * 1000);
  let displayDate = format(creationDate);
  displayDate = displayDate.substring(0, displayDate.indexOf(" ") + 2).replace(" ", ""); 
</script>

<div 
  class="relative p-2 flex items-center bg-foreground rounded-md border-r-4 { unread ? "border-r-accent" : "border-r-transparent" }"
  style="--color-variable:{hexToRgb(notification.media.img.color) || "--color-accent"}"
>
  <a href="#/media/{notification.media.id}" target="_blank" class="flex-none" use:link>
    <img src={notification.media.img.large} alt="Key visual" class="w-12 mr-4 object-center object-cover aspect-[3/4]" />
  </a>
  <a href="#/media/{notification.media.id}" class="line-clamp-3 mr-6 flex-1" use:link>
    {#if notification.type === NotificationType.AIRING}
      {notification.contexts[0]}
      {notification.episode}
      {notification.contexts[1]}
      <span class="font-medium hover:text-variable transition-colors">{notification.media.title.userPreferred}</span>
      {notification.contexts[2]}
    {:else if notification.type === NotificationType.RELATED_MEDIA_ADDITION}
      <span class="font-medium hover:text-variable transition-colors">{notification.media.title.userPreferred}</span>
      {notification.context}
    {/if}
  </a>
  <time class="absolute top-1 right-2 text-xs" datetime={creationDate.toISOString()} title={creationDate.toLocaleString()}>
    {displayDate}
  </time>
</div>