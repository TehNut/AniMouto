<script lang="ts">
  import { Route, useMatch } from "svelte-navigator";
  import { LoginPage, MediaListPage, MediaPage, NewPage, NotificationsPage, SearchPage, SettingsPage } from "../../entries/popup/routes";

  const isLoginPage = useMatch("/");
  const isMediaListPage = useMatch("/medialist");
  const isNewPage = useMatch("/new");
  const isSearchPage = useMatch("/search");
  const isNotificationsPage = useMatch("/notifications");
  const isSettingsPage = useMatch("/settings");
  const isMediaPage = useMatch("/media/:id");
</script>

{#if $isLoginPage}
  <Route path="/"><LoginPage /></Route>
{:else if $isMediaListPage}
  <Route path="/medialist"><MediaListPage /></Route>
{:else if $isNewPage}
  <Route path="/new"><NewPage /></Route>
{:else if $isSearchPage}
  <Route path="/search"><SearchPage /></Route>
{:else if $isNotificationsPage}
  <Route path="/notifications"><NotificationsPage /></Route>
{:else if $isSettingsPage}
  <Route path="/settings"><SettingsPage /></Route>
{:else if $isMediaPage}
  <Route path="/media/:id"><MediaPage /></Route>
{/if}