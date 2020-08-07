<template>
  <div>
    <h2 class="title">{{ $t("app.login.title") }}</h2>

    <div class="search-container">
      <input v-model="token" type="text" class="text-input" ref="codeField" :placeholder="$t('app.login.auth_code')" autocomplete="off" />
    </div>

    <div class="button no-select ripple" @click="getCode()" style="background:rgb(var(--color-orange))" ref="codeButton">{{ $t("app.login.get_code") }}</div>
    <div class="button no-select ripple" @click="handleLogin()" ref="loginButton">{{ $t("app.login.submit") }}</div>
    <a href="https://anilist.co/signup" target="_blank"><div class="button no-select ripple">{{ $t("app.login.sign_up") }}</div></a>
    <transition name="fade">
      <Spinner v-if="active"/>
    </transition>
    <div id="chrome-loader" class="loader" style="display:none;position:absolute;top:60px;"></div>
    <p style="color:rgb(var(--color-text))">{{ $t("app.login.ff_instruct_1") }}</p>
    <p style="color:rgb(var(--color-text))">{{ $t("app.login.ff_instruct_2") }}</p>
    <p style="color:rgb(var(--color-text))">{{ $t("app.login.ff_instruct_3") }}</p>
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
