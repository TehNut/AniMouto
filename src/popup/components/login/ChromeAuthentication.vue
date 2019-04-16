<template>
  <div>
    <h2 class="title">Login with AniList to use AniMouto</h2>
    <div class="button no-select" @click="handleLogin()" ref="loginButton">Login</div>
    <transition name="fade">
      <Spinner v-if="active"/>
    </transition>
    <div id="chrome-loader" class="loader" style="display:none;position:absolute;top:60px;"></div>
    <p style="color:rgb(var(--color-text))">Once authentication is complete, the page will change.</p>
  </div>
</template>

<script>
  import Spinner from "../base/Spinner";
  export default {
    name: "ChromeAuthentication",
    components: {Spinner},
    data() {
      return {
        active: false
      }
    },
    methods: {
      handleLogin() {
        const button = this.$refs.loginButton;
        if (button.classList.contains("disabled"))
          return;

        this.active = true;
        button.classList.add("disabled");
        chrome.runtime.getBackgroundPage(page => page.beginAuthorizationFlow());
      }
    },
    mounted() {
      const _self = this;
      chrome.storage.local.get({ access_token: "" }, value => {
        if (value.access_token === "")
          return;

        // fixme
        // _self.$refs.loginButton.title = "Already logged in.";
        // _self.$refs.loginButton.classList.add("disabled");
      });
    }
  }
</script>
