<script lang="ts">
  import { format } from "timeago.js";

  export let createdAt: number;
  export let unread = false;

  const creationDate = new Date(createdAt * 1000);
  let displayDate = format(creationDate);
  displayDate = displayDate.substring(0, displayDate.indexOf(" ") + 2).replace(" ", ""); 
</script>

<div 
  class="relative p-2 flex items-center bg-foreground rounded-md border-r-4 { unread ? "border-r-accent" : "border-r-transparent" }"
  on:click={() => unread = false}
>
  <slot />
  <time class="absolute top-1 right-2 text-xs" datetime={creationDate.toISOString()} title={creationDate.toLocaleString()}>
    {displayDate}
  </time>
</div>