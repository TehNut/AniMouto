<template>
  <div>
    <h2 class="title">Login with AniList to use AniMouto</h2>

    <div class="search-container">
      <input v-model="token" type="text" class="text-input" ref="codeField" placeholder="Authorization Code" autocomplete="off" />
    </div>

    <div class="button no-select ripple" @click="getCode()" style="background:rgb(var(--color-orange))" ref="codeButton">Get Code</div>
    <div class="button no-select ripple" @click="handleLogin()" ref="loginButton">Login</div>
    <a href="https://anilist.co/signup" target="_blank"><div class="button no-select ripple">Sign Up</div></a>
    <transition name="fade">
      <Spinner v-if="active"/>
    </transition>
    <div id="chrome-loader" class="loader" style="display:none;position:absolute;top:60px;"></div>
    <p style="color:rgb(var(--color-text))">To obtain an authorization code, click the "Get Code" button above. It should open a new window that will let you authenticate with AniList. Once authenticated, it will provide an authorization code for you to copy.</p>
    <p style="color:rgb(var(--color-text))">Paste your authorization code into the text field to authenticate. Don't forget to close the extra window when you finish.</p>
    <p style="color:rgb(var(--color-text))">Once authentication is complete, the page will change.</p>
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
        const url = "https://anilist.co/api/v2/oauth/authorize?client_id=1336&response_type=token";
        this.$browser.identity.launchWebAuthFlow({ url, interactive: true });
      },
      handleLogin() {
        if (this.token.length > 0)
          this.$emit("token", this.token)
      }
    }
  }
</script>

<style scoped>

</style>
