<script lang="ts">
  import { format } from "timeago.js";
  import type { JwtPayload } from "jwt-decode";
  import jwtDecode from "jwt-decode";
  import { Theme, Accent } from "$lib/model";
  import { extensionConfig, user, token, loggedIn } from "$lib/store";
  import Tooltip from "$lib/components/Tooltip.svelte";
  import Section from "$lib/components/Section.svelte";
  import Button from "$lib/components/Button.svelte";

  const themes: { theme: Theme, background: String, color: string }[] = [
    {             
      theme: Theme.LIGHT,
      background: "rgb(237, 241, 245)",
      color: "rgb(92, 114, 138)"
    },
    {
      theme: Theme.DARK_OLD,
      background: "rgb(39, 44, 56)",
      color: "rgb(159, 173, 189)"
    },
    {
      theme: Theme.DARK,
      background: "rgb(11, 22, 34)",
      color: "rgb(159,173,189)"
    },
    {
      theme: Theme.CONTRAST,
      background: "rgb(214, 224, 239)",
      color: "rgb(0, 0, 0)"
    }
  ];

  function getTokenExpiration(): Date {
    return new Date(jwtDecode<JwtPayload>($token).exp * 1000);
  }
</script>

{#if $loggedIn}
  <Section title="Account">
    <h2 class="text-base">Logged in as <span class="text-accent">{$user.name}</span></h2>
    <p class="mt-1">
      Your token will expire on
      <Tooltip placement="top" content={format(getTokenExpiration())}>
        <span class="text-orange">{getTokenExpiration().toLocaleDateString()}</span>
      </Tooltip>
      . You will need to re-login after this date.
    </p>
    <div class="flex space-x-2 my-2">
      <Button type="WARNING" on:click={() => user.logout()}>
        Logout
      </Button>
      <Button on:click={() => user.fetch()}>
        Update User
      </Button>
    </div>
    <p class="text-xs">Don't forget to <a href="https://anilist.co/settings/apps" target="_blank" class="text-red">revoke your token</a> after logging out.</p>
  </Section>
{/if}

<Section title="Theme">
  <h3 class="ml-4 mb-1 font-semibold">Primary Colors</h3>
  <div class="flex capitalize">
    {#each themes as theme}
      <Tooltip placement="top" content={theme.theme.replace("-", " ")}>
        <button 
          class="w-8 h-8 mx-2 border-2 border-text-400 font-bold"
          style="background-color:{theme.background};color:{theme.color}"
          on:click={() => $extensionConfig.theme.primary = theme.theme}
        >A</button>
      </Tooltip>
    {/each}
  </div>
  <h3 class="ml-4 mb-1 font-semibold mt-2">Accent Color</h3>
  <div class="flex capitalize">
    {#each Object.values(Accent) as accent}
      <Tooltip placement="top" content={accent.replace("-", " ")}>
        <button
          class="w-8 h-8 mx-1 rounded-md hover:rounded-full bg-variable border-2 border-text-300 transition-all"
          style="--color-variable:var(--color-{accent})"
          on:click={() => $extensionConfig.theme.accent = accent}
        />
      </Tooltip>
    {/each}
  </div>
  <label class="flex items-center mt-4 text-lg cursor-pointer">
    <input 
      type="checkbox"
      class="w-5 h-5"
      bind:checked={$extensionConfig.theme.wide} 
    >
    <span class="ml-2">Wide view</span>
  </label>
</Section>

<div class="my-2" />

<Section title="Notifications">
  <label class="flex items-center mt-4 text-lg cursor-pointer">
    <input 
      type="checkbox"
      class="w-5 h-5"
      bind:checked={$extensionConfig.notifications.enablePolling} 
    >
    <span class="ml-2">Notification Polling</span>
  </label>
  <p>Allows periodic background checks for new notifications.</p>
  <label class="flex flex-col {!$extensionConfig.notifications.enablePolling ? "pointer-events-none cursor-not-allowed opacity-50" : ""}">
    <span class="ml-4 mb-1 font-semibold mt-2">Polling Interval</span>
    <input 
      type="number"
      class="bg-background py-1 px-2 rounded-md"
      min={1}
      bind:value={$extensionConfig.notifications.pollingInterval}
    >
  </label>
  <p>The number of minutes between polling checks.</p>
</Section>