<template>
  <div>
    <h1 class="section-title">Notifications</h1>
    <div class="section">
      <h2 class="title">Timed Check</h2>
      <p class="subtext">Whether or not AniMouto should regularly check for new notifications in the background.</p>
      <Checkbox v-model="periodicCheck" :title="'Enable automatic checks'" :identifier="'periodic-check'"/>

      <br/>
      <br/>

      <h2 class="title">Check Interval</h2>
      <p class="subtext">The amount of time <span class="highlight">in minutes</span> between checks for new notifications.</p>

      <br/>
      <br/>

      <h2 class="title">Desktop Notifications</h2>
      <p class="subtext">Allow AniMouto to send desktop notifications when a new notification is found.</p>
      <Checkbox v-model="desktopNotifications" :title="'Enable desktop notifications'" :identifier="'desktop-notifications'"/>

      <br/>

      <div class="button" @click="save">Save</div>
    </div>
  </div>
</template>

<script>
  import Checkbox from "../../base/Checkbox";
  export default {
    name: "NotificationSection",
    components: {Checkbox},
    data() {
      return {
        periodicCheck: true,
        desktopNotifications: true
      }
    },
    methods: {
      save() {
        chrome.storage.local.set({ notifications: { enabled: this.periodicCheck, desktop: false } });

        if (this.desktopNotifications) {
          chrome.permissions.request({ permissions: ["notifications"] }, granted => {
            chrome.storage.local.set({ notifications: { desktop: granted } });
          });
        }

      }
    }
  }
</script>

<style scoped>

</style>
