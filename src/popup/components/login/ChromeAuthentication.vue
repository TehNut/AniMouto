<template>
  <div>
    <h2 class="title">Login with AniList to use AniMouto</h2>
    <h2 class="title" style="color:rgb(var(--color-red))" v-if="reason">{{ reason }}</h2>

    <div class="button no-select ripple" @click="handleLogin()" ref="loginButton">Login</div>
    <a href="https://anilist.co/signup" target="_blank"><div class="button no-select ripple">Sign Up</div></a>
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
    params: {
      reason: String
    },
    methods: {
      handleLogin() {
        const button = this.$refs.loginButton;
        if (button.classList.contains("disabled"))
          return;

        this.active = true;
        button.classList.add("disabled");

        const url = "https://anilist.co/api/v2/oauth/authorize?client_id=1387&response_type=token";
        this.$browser.identity.launchWebAuthFlow({ url, interactive: true }).then(res => {
          if (this.$browser.identity.lastError) {
            console.error(this.$browser.identity.lastError);
            return null;
          }

          return res.split("#")[1].split("&")[0].split("=")[1];
        }).then(token => { this.$emit("token", token) });
      }
    },
    mounted() {
      this.$browser.storage.local.get({ access_token: "" }).then(value => {
        if (value.access_token === "")
          return;

        // fixme
        // _self.$refs.loginButton.title = "Already logged in.";
        // _self.$refs.loginButton.classList.add("disabled");
      });
    }
  }
</script>
