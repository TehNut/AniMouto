<template>
  <div>
    <h1 class="section-title">Account</h1>
    <div class="section">
      <h2 class="title">Logged in as <a :href="user.url" class="highlight">{{ user.name }}</a></h2>
      <div class="button no-select ripple" @click="logout">Logout</div>
      <p style="margin:0">Remember to revoke the access token from your <a href="https://anilist.co/settings/apps">Apps page</a> after logging out.</p>
    </div>
  </div>
</template>

<script>
  import {updateUser} from "../../../../assets/js/utils";

  export default {
    name: "AccountSection",
    data() {
      return {
        user: {
          name: "",
          url: ""
        }
      }
    },
    methods: {
      logout() {
        this.$browser.storage.local.clear();
        this.$router.push("login");
        this.$emit("update-theme");
        updateUser();
        this.$emit("add-toast", { message: "Logout successful" })
      }
    },
    created() {
      const _self = this;
      chrome.storage.local.get({ user_info: { name: "", site_url: "https://anilist.co" } }, value => {
        _self.user.name = value.user_info.name;
        _self.user.url = value.user_info.site_url;
      });
    }
  }
</script>
