<script lang="ts">
  import { Link } from "svelte-navigator";
  import { NotificationType, type MediaFragment, type AiringNotification, type RelatedMediaAdditionNotification, type MediaDataChangeNotification } from "@anilist/graphql";
  import { hexToRgb } from "$lib/util";
  import NotificationContainer from "./NotificationContainer.svelte";

  export let notification: Pick<AiringNotification | RelatedMediaAdditionNotification | MediaDataChangeNotification, "createdAt" | "type"> & {
    context?: string,
    contexts?: string[],
    episode?: number,
    media: Pick<MediaFragment, "id" | "title" | "img">,
  };
  export let unread = false;
</script>

<NotificationContainer {unread} createdAt={notification.createdAt}>
  <Link to="/media/{notification.media.id}" class="flex-none">
    <img src={notification.media.img.large} alt="Key visual" class="w-12 mr-4 object-center object-cover aspect-[3/4]" />
  </Link>
  <Link to="/media/{notification.media.id}" class="line-clamp-3 mr-6 flex-1" --color-variable={hexToRgb(notification.media.img.color) || "--color-accent"}>
    {#if notification.type === NotificationType.AIRING}
      {notification.contexts[0]}
      {notification.episode}
      {notification.contexts[1]}
      <span class="font-medium hover:text-variable transition-colors">{notification.media.title.userPreferred}</span>
      {notification.contexts[2]}
    {:else}
      <span class="font-medium hover:text-variable transition-colors">{notification.media.title.userPreferred}</span>
      {notification.context}
    {/if}
  </Link>
</NotificationContainer>