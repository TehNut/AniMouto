<template>
  <div>
    <h2 class="title">Login with AniList to use AniMouto</h2>

    <div class="search-container">
      <input v-model="token" type="text" class="text-input" ref="codeField" placeholder="Authorization Code" autocomplete="off" />
    </div>

    <div class="button no-select" @click="getCode()" style="background:rgb(var(--color-orange))" ref="codeButton">Get Code</div>
    <div class="button no-select" @click="handleLogin()" ref="loginButton">Login</div>
    <transition name="fade">
      <Spinner v-if="active"/>
    </transition>
    <div id="chrome-loader" class="loader" style="display:none;position:absolute;top:60px;"></div>
    <p style="color:rgb(var(--color-text))">Paste your authorization code into the text field to authenticate. Don't forget to close the extra window when you finish.</p>
  </div>
</template>

<script>
  import Spinner from "../base/Spinner";
  export default {
    name: "FirefoxAuthentication",
    components: {Spinner},
    data() {
      return {
        active: false,
        token: ""
      }
    },
    methods: {
      getCode() {
        chrome.runtime.getBackgroundPage(page => page.beginAuthorizationFlow());
      },
      handleLogin() {
        const _self = this;
        chrome.runtime.getBackgroundPage(page => page.validateToken(_self.token));
      }
    }
  }
</script>

<style scoped>

</style>
