<script lang="ts">
  import { writable } from "svelte/store";
  import type { FlyParams } from "svelte/transition";
  import { fly } from "svelte/transition";
  import type { Placement, Side } from "@floating-ui/dom";
  import { shift, flip, offset as offsetMiddleware } from "@floating-ui/dom";
  import { createFloatingActions, arrow } from "$lib/floating";
import { tick } from "svelte";

  let containerClasses: string = "";
  export { containerClasses as class };
  export let placement: Placement;
  export let content: string = "";
  export let offset: number = 6;

  $: staticSide = getArrowSide(placement);
  $: transitionProps = {
    duration: 200,
    x: staticSide === "left" ? -5 : staticSide === "right" ? 5 : 0,
    y: staticSide === "top" ? -5 : staticSide === "bottom" ? 5 : 0,
  };

  const arrowRef = writable<HTMLElement>(null);
  const [ floatingRef, floatingContent ] = createFloatingActions({
    strategy: "absolute",
    placement,
    middleware: [
      offsetMiddleware({ mainAxis: offset }),
      shift(),
      flip(),
      arrow({ element: arrowRef }),
    ],
    async onComputed({ middlewareData, placement: newPlacement }) {
      placement = newPlacement;
      const { x, y } = middlewareData.arrow;

      await tick();

      Object.assign($arrowRef.style, {
        left: x != null ? `${x}px` : "",
        top: y != null ? `${y}px` : "",
        [staticSide]: "-4px"
      });

    }
  });

  let shown = false;

  function getArrowSide(placement: Placement): Side {
    return {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[placement.split('-')[0]] as Side;
  }
</script>

<span
  on:mouseenter={() => shown = true}
  on:mouseleave={() => shown = false}
  use:floatingRef
  class={containerClasses}
>
  <slot />
</span>

{#if shown}
  <div transition:fly={transitionProps} class="absolute z-50 py-2 px-3 bg-overlay text-text-100 font-medium text-xs rounded-md pointer-events-none shadow-md" use:floatingContent>
    <slot name="content">
      {content}
    </slot>
    <div class="absolute w-2 h-2 bg-overlay rotate-45" bind:this={$arrowRef} />
  </div>
{/if}