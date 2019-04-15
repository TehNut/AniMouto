<template>
  <div>
    <div class="button" @click="logout"></div>
  </div>
</template>

<script>
  import {updateUser} from "../../assets/js/utils";

  export default {
    name: "Settings",
    methods: {
      logout() {
        chrome.storage.local.clear();
        this.$router.push("login");
        updateUser();
      }
    }
  }
</script>

<style scoped>

</style>
