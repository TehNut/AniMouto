<template>
  <div>
    <ChromeAuthentication v-if="isChrome" @token="handleToken" :reason="reason"/>
    <FirefoxAuthentication v-else @token="handleToken" :reason="reason"/>
  </div>
</template>

<script>
  import ChromeAuthentication from "./ChromeAuthentication";
  import FirefoxAuthentication from "./FirefoxAuthentication";
  import viewerQuery from "../../../assets/graphql/viewer.graphql";
  import {queryAL, updateUser} from "../../../assets/js/utils";

  export default {
    name: "Login",
    components: {FirefoxAuthentication, ChromeAuthentication},
    data() {
      return {
        isChrome: typeof InstallTrigger === 'undefined'
      }
    },
    params: {
      reason: String
    },
    methods: {
      handleToken(token) {
        if (!token)
          return;

        this.$browser.storage.local.set({ access_token: token });

        queryAL(viewerQuery, {}, token).then(res => res.data.Viewer).then(res => {
          this.$browser.storage.local.set({
            user_info: {
              id: res.id,
              name: res.name,
              site_url: res.siteUrl,
              avatar: res.avatar.large,
            }
          });
        }).then(() => {
          this.$router.push("/medialist");
          this.$browser.storage.local.set({ last_page: "medialist" });
          updateUser();
        });
      }
    }
  }
</script>

<style scoped>

</style>
