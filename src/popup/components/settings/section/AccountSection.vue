<template>
  <div>
    <h1 class="section-title">Account</h1>
    <div class="section">
      <h2 class="title">Logged in as <a :href="user.url" class="highlight">{{ user.name }}</a></h2>
      <div class="button" @click="logout">Logout</div>
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
        chrome.storage.local.clear();
        this.$router.push("login");
        updateUser();
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
