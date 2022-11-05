<script lang="ts">
  export let title: string = "";
  export let maxContentHeight = -1;
  export let raise = true;
</script>

<div class="relative flex flex-col space-y-1">
  <h2 class="ml-4 font-semibold">
    <slot name="title">
      {title}
    </slot>
  </h2>
  <div class="{raise ? "p-4 bg-foreground" : "py-2"} rounded-md text-sm" style="{maxContentHeight > 0 ? `max-height:${maxContentHeight}px;overflow-y:scroll` : ""}">
    <slot />
  </div>
</div>