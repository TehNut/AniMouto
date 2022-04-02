<script lang="ts">
  import { onMount } from "svelte";
  import { storage } from "webextension-polyfill";
  import Router, { push } from "svelte-spa-router";
  import type { RouteLoadedEvent } from "svelte-spa-router";
  import { faListUl, faSearch, faBell, faCog, faSignInAlt, faBullhorn } from "@fortawesome/free-solid-svg-icons";
  import { setClient } from "@urql/svelte";
  import "$assets/app.css";
  import anilistLogo from "$assets/anilist.svg";
  import { client } from "$lib/graphql";
  import routes from "./routes";
  import NavLink from "$lib/components/NavLink.svelte";
  import { extensionConfig, lastPage, loggedIn, user, unreadNotifications } from "$lib/store";

  setClient(client);

  onMount(async () => {
    push($lastPage);
    if ($loggedIn) {
      const { data } = await client.query("{ Viewer { unreadNotificationCount } }").toPromise();
      $unreadNotifications = data.Viewer.unreadNotificationCount;
      await storage.local.set({ unreadNotificationCount: $unreadNotifications });
    }
  });

  function onRouteChange(e: RouteLoadedEvent) {
    $lastPage = e.detail.location;
  }
</script>

<div 
  class="root {$extensionConfig.theme.wide ? "w-[716px]" : "w-[525px]"} h-[600px] flex theme-{$extensionConfig.theme.primary} text-base" style="--color-accent:var(--color-{$extensionConfig.theme.accent})">
  <nav class="w-14 h-full flex-none flex flex-col items-center justify-between bg-variable border-r-4 border-r-accent" style="--color-variable:var(--sidebar-background)">
    <a href={$user.siteUrl} target="_blank" class="flex-none mt-2">
      <img src={$user.avatar.large} alt="User avatar" class="rounded-full aspect-square w-12">
    </a>
    <div class="mt-4 flex-1 w-full flex flex-col space-y-2">
      {#if !$loggedIn}
        <NavLink href="/" icon={faSignInAlt} title="Login" />
      {/if}
      {#if $loggedIn}
        <NavLink href="/medialist" icon={faListUl} title="Media Overview" />
      {/if}
      <NavLink href="/new" icon={faBullhorn} title="What's New" />
      <NavLink href="/search" icon={faSearch} title="Search" />
      {#if $loggedIn}
        <NavLink href="/notifications" icon={faBell} title="Notifications">
          {#if $unreadNotifications > 0}
            <span class="absolute -bottom-1 right-0.5 w-6 h-6 bg-red text-white text-sm text-center font-semibold rounded-full border-2 border-variable">
              {$unreadNotifications < 100 ? $unreadNotifications : "99+"}
            </span>
          {/if}
        </NavLink>
      {/if}
      <NavLink href="/settings" icon={faCog} title="Settings" />
    </div>
    <a href="https://anilist.co" target="_blank" class="flex-none">
      <img src={anilistLogo} alt="AniList Logo">
    </a>
  </nav>
  <div class="flex-1 p-2 relative h-full bg-background text-text-400 overflow-y-auto overflow-x-hidden">
    <Router {routes} restoreScrollState on:routeLoaded={onRouteChange} />
  </div>
</div>