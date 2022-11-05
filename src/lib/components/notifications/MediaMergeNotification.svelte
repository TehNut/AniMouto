<script lang="ts">
  import { Link } from "svelte-navigator";
  import type { MediaMergeNotification, MediaFragment } from "@anilist/graphql";
  import NotificationContainer from "./NotificationContainer.svelte";
  import { hexToRgb } from "$lib/util";

  export let notification: Pick<MediaMergeNotification, "createdAt" | "deletedMediaTitles" | "context"> & {
    media?: MediaFragment
  };
  export let unread = false;
</script>

<NotificationContainer {unread} createdAt={notification.createdAt}>
  <Link to="/media/{notification.media.url}" class="flex-none">
    <img src={notification.media.img.large} alt="Key visual" class="w-12 mr-4 object-center object-cover aspect-[3/4]" />
  </Link>
  <Link to="/media/{notification.media.id}" class="line-clamp-3 mr-6 flex-1" --color-variable={hexToRgb(notification.media.img.color) || "--color-accent"}>
    {notification.deletedMediaTitles.join(", ")}
    {notification.context}
    {notification.media.title.userPreferred}
  </Link>
</NotificationContainer>