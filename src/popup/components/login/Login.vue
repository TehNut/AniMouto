<template>
  <div>
    <ChromeAuthentication v-if="isChrome" />
    <FirefoxAuthentication v-else />
  </div>
</template>

<script>
  import ChromeAuthentication from "./ChromeAuthentication";
  import FirefoxAuthentication from "./FirefoxAuthentication";
  export default {
    name: "Login",
    components: {FirefoxAuthentication, ChromeAuthentication},
    data() {
      return {
        isChrome: typeof InstallTrigger === 'undefined'
      }
    }
  }
</script>

<style scoped>

</style>
