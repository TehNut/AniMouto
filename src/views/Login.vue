<template>
  <div>
    <div>
      <h1>Login</h1>
    </div>
    <Button text="login" @click="handleLogin()">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import Button from "@/components/Button.vue";
import { browser } from "webextension-polyfill-ts";
import { AniListUser } from '@/models/User';

const user = namespace("user");
const root = namespace("root");

@Component({
  components: {
    Button
  }
})
export default class Login extends Vue {
  @user.Action
  login!: (app: Vue) => Promise<void>;

  @user.Getter
  loggedIn!: boolean;

  @root.Action
  changePage!: (page: string) => Promise<void>;

  async handleLogin() {
    await this.login(this);
    await this.changePage("list");
    this.$router.push("list").catch(e => {});
  }

  async created() {
    if (this.loggedIn) {
      await this.changePage("list");
      this.$router.push("list").catch(e => {});
    }
  }
}
</script>

<style>

</style>