<script lang="ts">
  import { tick } from "svelte";
  import { writable } from "svelte/store";
  import type { FlyParams } from "svelte/transition";
  import { fly } from "svelte/transition";
  import type { Placement, Side } from "@floating-ui/dom";
  import { shift, flip, offset as offsetMiddleware } from "@floating-ui/dom";
  import { createFloatingActions, arrow } from "$lib/actions";

  let containerClasses: string = "";
  export { containerClasses as class };
  export let placement: Placement;
  export let content: string = "";
  export let offset: number = 6;

  $: staticSide = getArrowSide(placement);
  $: arrowRotation = getArrowRotation(placement);
  $: transitionProps = {
    duration: 200,
    x: staticSide === "left" ? -5 : staticSide === "right" ? 5 : 0,
    y: staticSide === "top" ? -5 : staticSide === "bottom" ? 5 : 0,
  } as FlyParams;

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
        [staticSide]: "-5px"
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

  function getArrowRotation(placement: Placement): string {
    return {
      top: 'rotate-[135deg]',
      right: 'rotate-[225deg]',
      bottom: 'rotate-[315deg]',
      left: 'rotate-45',
    }[placement.split("-")[0]];
  }
</script>

<div
  on:mouseenter={() => shown = true}
  on:mouseleave={() => shown = false}
  use:floatingRef
  class="relative {containerClasses}"
>
  <slot />
  {#if shown}
    <div transition:fly={transitionProps} class="absolute w-max z-50 py-2 px-3 bg-black/90 text-white border-black border font-medium text-xs rounded-md pointer-events-none shadow-md" use:floatingContent>
      <slot name="content">
        {content}
      </slot>
      <div class="absolute w-2 h-2 bg-black/90 border-black border-r border-t {arrowRotation}" bind:this={$arrowRef} />
    </div>
  {/if}
</div>
