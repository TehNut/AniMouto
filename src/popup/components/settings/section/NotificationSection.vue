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
      <input type="number" v-model="interval" class="text-input settings-text-input" placeholder="Minutes" autocomplete="off"/>
      <span class="highlight settings-text-input-label">Minute(s)</span>

      <br/>
      <br/>
      <br/>

      <h2 class="title">Desktop Notifications</h2>
      <p class="subtext">Allow AniMouto to send desktop notifications when a new notification is found.</p>
      <Checkbox v-model="desktopNotifications" :title="'Enable desktop notifications'" :identifier="'desktop-notifications'"/>

      <br/>

      <div class="button no-select ripple" @click="save">Save</div>
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
        desktopNotifications: true,
        interval: 1
      }
    },
    created() {
      const _self = this;
      this.$browser.storage.local.get().then(v => {
        _self.periodicCheck = v.notifications.enabled;
        _self.desktopNotifications = v.notifications.desktop;
        _self.interval = v.notifications.interval || 1;
      });
    },
    methods: {
      save() {
        this.$browser.storage.local.set({ notifications: { enabled: this.periodicCheck, desktop: false } }).then(v => console.log(v));
        const _self = this;

        if (this.desktopNotifications) {
          this.$browser.permissions.request({ permissions: ["notifications"] }).then(granted => {
            _self.$browser.storage.local.set({ notifications: { enabled: _self.periodicCheck, desktop: granted } });
          });
        }
      }
    }
  }
</script>
