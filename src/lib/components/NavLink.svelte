<script lang="ts">
  import { Link } from "svelte-navigator"
  import Icon from "svelte-fa";
  import type { IconDefinition } from "@fortawesome/fontawesome-common-types";
  import Tooltip from "$lib/components/Tooltip.svelte";

  let classNames: string = "";
  export { classNames as class };
  export let icon: IconDefinition;
  export let href: string;
  export let title: string;
</script>

<Tooltip placement="right" content={title}>
  <Link to={href} class="relative w-full flex justify-center text-text-300 hover:text-accent transition-colors">
    <Icon {icon} class="{classNames} text-xl my-1" />
    <slot />
  </Link>
</Tooltip>