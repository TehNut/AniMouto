<template>
  <div>
    <h1 class="section-title">Account</h1>
    <div class="section">
      <h2 class="title">Logged in as <a :href="user.url" class="highlight">{{ user.name }}</a></h2>
      <div class="button no-select ripple" @click="logout">Logout</div>
      <div class="button no-select ripple" @click="updateUser">Refresh User</div>
      <p style="margin:0">Remember to revoke the access token from your <a href="https://anilist.co/settings/apps" target="_blank">Apps page</a> after logging out.</p>
      <div v-if="debugArray.length > 0" class="button no-select ripple" @click="printDebug">Copy Logout Debug</div>
    </div>
  </div>
</template>

<script>
  import {updateUser, queryAL} from "../../../../assets/js/utils";
  import viewerQuery from "../../../../assets/graphql/viewer.graphql";

  export default {
    name: "AccountSection",
    data() {
      return {
        user: {
          name: "",
          url: ""
        },
        debugArray: []
      }
    },
    methods: {
      logout() {
        this.$browser.storage.local.clear();
        this.$router.push("/login");
        this.$emit("update-theme");
        updateUser();
        this.$emit("add-toast", { message: "Logout successful" })
      },
      printDebug() {
        window.navigator.clipboard.writeText(JSON.stringify(this.debugArray, null, 2));
      },
      updateUser() {
        const _self = this;
        this.$browser.storage.local.get().then(v => {
          if (v.access_token === "") {
            this.logout();
            return;
          }

          queryAL(viewerQuery, {}, v.access_token).then(res => res.data.Viewer).then(viewer => {
            this.$browser.storage.local.set({ user_info: { name: viewer.name, id: viewer.id, site_url: viewer.siteUrl, avatar: viewer.avatar.large } });
            updateUser();
            _self.user.name = viewer.name;
            _self.user.url = viewer.siteUrl;
          });
        })
      }
    },
    created() {
      const _self = this;
      this.$browser.storage.local.get({ user_info: { name: "", site_url: "https://anilist.co" }, logoutDebugArray: [] }).then(value => {
        _self.user.name = value.user_info.name;
        _self.user.url = value.user_info.site_url;
        _self.debugArray = value.logoutDebugArray;
      });
    }
  }
</script>
