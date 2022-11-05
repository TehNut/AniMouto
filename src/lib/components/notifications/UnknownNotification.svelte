<script lang="ts">
  import Icon from "svelte-fa";
  import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
  import type { GetNotificationsQuery } from "@anilist/graphql";
  import NotificationContainer from "./NotificationContainer.svelte";

  export let notification: GetNotificationsQuery["Page"]["notifications"][0];
  export let unread = false;
</script>

<NotificationContainer {unread} createdAt={notification.createdAt}>
  <Icon icon={faInfoCircle} class="flex-none w-12 text-3xl mr-4 aspect-square text-yellow" />
  <span class="line-clamp-3 mr-6 flex-1">
    {notification.type}
    is an unknown notification type. Please 
    <a href="https://github.com/TehNut/AniMouto" target="_blank" class="text-accent">report this</a>
    so it can be supported!
  </span>
</NotificationContainer>