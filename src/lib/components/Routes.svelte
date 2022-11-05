<script lang="ts">
  import { Route } from "svelte-navigator";
  import {
    LoginPage,
    MediaListPage,
    MediaPage,
    NewPage,
    NotificationsPage,
    SearchPage,
    SettingsPage
  } from "../../entries/popup/routes";
</script>

<Route path="/"><LoginPage /></Route>
<Route path="/medialist"><MediaListPage /></Route>
<Route path="/new"><NewPage /></Route>
<Route path="/search"><SearchPage /></Route>
<Route path="/notifications"><NotificationsPage /></Route>
<Route path="/settings"><SettingsPage /></Route>
<Route path="/media/:id"><MediaPage /></Route>