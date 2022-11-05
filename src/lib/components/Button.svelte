<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
  import Icon from "svelte-fa";

  export let disabled: boolean = false;
  export let type: "INFO" | "WARNING" | "ERROR" | "VARIABLE" = "INFO";
  export let icon: IconDefinition = null;
  let customClasses = "";
  export { customClasses as class };

  const dispatch = createEventDispatcher();

  function getColor() {
    switch (type) {
      case "INFO": return "bg-accent text-white";
      case "WARNING": return "bg-orange text-white";
      case "ERROR": return "bg-red text-white";
      case "VARIABLE": return "bg-variable text-white"
    }
  }

  function onClick() {
    if (!disabled)
      dispatch("click");
  }
</script>

<button 
  {disabled}
  on:click={onClick}
  class="{customClasses} {getColor()} px-4 py-3 flex justify-center rounded-md font-medium hover:bg-opacity-95 disabled:bg-text-400/60 disabled:text-400 disabled:cursor-not-allowed"
>
  {#if icon}
    <Icon class={$$slots.default ? "mr-2" : ""} {icon} />
  {/if}
  <slot />
</button>