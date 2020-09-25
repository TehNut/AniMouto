<template>
  <div>
    <h1 class="section-title">Account</h1>
    <div class="section">
      <h2 class="title">Logged in as <a :href="user.url" class="highlight">{{ user.name }}</a></h2>
      <div class="button no-select ripple" @click="logout">Logout</div>
      <div class="button no-select ripple" @click="updateUser">Refresh User</div>
      <p style="margin:0">Remember to revoke the access token from your <a href="https://anilist.co/settings/apps" target="_blank">Apps page</a> after logging out.</p>
      <br>
      <h2 class="title">Logout on Invalid Token</h2>
      <p class="subtext">
        After a year, authentication tokens are invalidated. By default, AniMouto will make you re-authenticate when this
        happens. If you experience issues with being sporadically logged out, you can disable this, however doing so will
        cause the extension to break when your token expires.
      </p>
      <Checkbox v-model="logoutOnInvalidToken" title="Logout on Invalid Token" identifier="logoutOnInvalidToken" @input="save()"/>
    </div>
  </div>
</template>

<script>
  import {updateUser, queryAL} from "../../../../assets/js/utils";
  import Checkbox from "../../base/Checkbox";
  import viewerQuery from "../../../../assets/graphql/viewer.graphql";

  export default {
    name: "AccountSection",
    components: {
      Checkbox
    },
    data() {
      return {
        user: {
          name: "",
          url: ""
        },
        logoutOnInvalidToken: true
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
      save() {
        this.$browser.storage.local.set({ logoutOnInvalidToken: this.logoutOnInvalidToken });
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
      this.$browser.storage.local.get({ user_info: { name: "", site_url: "https://anilist.co" }, logoutOnInvalidToken: true }).then(value => {
        _self.user.name = value.user_info.name;
        _self.user.url = value.user_info.site_url;
        _self.logoutOnInvalidToken = value.logoutOnInvalidToken;
      });
    }
  }
</script>
