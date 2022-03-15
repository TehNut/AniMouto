<script lang="ts">
  import Tooltip from "$lib/components/Tooltip.svelte";
  import { computePosition } from "@floating-ui/dom";
import { onMount } from "svelte";

  let el: HTMLElement = null;
  let tooltip: HTMLElement = null;
  let showTooltip = false;

  onMount(() => {
    computePosition(el, tooltip, {
      placement: "left",
      strategy: "absolute"
    }).then(({ strategy, x, y }) => {
      Object.assign(tooltip.style, {
        position: strategy,
        left: `${x}px`,
        top: `${y}px`,
      })
    });
  });
</script>

<div class="w-[500px] h-[500px] flex">
  <!-- <div class="flex-none w-24 bg-red"></div> -->
  <div class="flex-1 bg-blue">
    <div class="w-full h-full flex justify-center items-center">
      <div class="w-[72%] flex">
        <div class="w-8 flex-none bg-orange">Left</div>
        <div class="flex-1 bg-peach">Center</div>
        <div class="w-8 flex-none bg-green">
          <button bind:this={el} on:click={() => showTooltip = !showTooltip}>Right</button>
          <div bind:this={tooltip} class="absolute {showTooltip ? "block" : "hidden"}">
            Tooltip
          </div>
        </div>
      </div>
    </div>
  </div>
</div>