<template>
  <div id="app">
    <div class="container">
      <div class="sidebar theme-dark">
        <div class="avatar">
          <a :href="user.siteUrl" target="_blank">
            <img :src="user.avatar.large">
          </a>
        </div>
        <br>
        <div class="navigation">
          <navigation-icon page="list" icon="list"/>
          <navigation-icon page="search" icon="search"/>
          <navigation-icon page="notifications" icon="bell"/>
          <navigation-icon page="forum" icon="comments"/>
          <navigation-icon page="settings" icon="cog"/>
          <navigation-icon page="about" icon="info-circle"/>
        </div>
        <div class="anilist-logo">
          <a href="https://anilist.co" target="_blank">
            <img src="img/anilist.svg">
          </a>
        </div>
      </div>
      <div class="content">
        <keep-alive>
          <router-view />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { AniListUser } from '@/models/User';
import NavigationIcon from "@/components/NavigationIcon.vue"

const root = namespace("root");
const user = namespace("user");

@Component({
  components: {
    NavigationIcon
  }
})
export default class App extends Vue {
  @root.Getter("lastPage")
  lastPage!: string;

  @user.Getter("user")
  user!: AniListUser;

  @user.Getter("loggedIn")
  loggedIn!: boolean;

  created() {
    let page = this.lastPage;
    if (!this.loggedIn)
      page = "login";

    this.$router.push(page).catch(e => {});
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
@import url("assets/themes.css");

:root {
  --content-width: 525px;
}

body {
  font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 12px;
  line-height: 1.15;
  margin: 0;
  background-color: rgb(var(--color-background));
  color: rgb(var(--color-text));
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track {
  background: none;
}
::-webkit-scrollbar-thumb {
  background: rgb(var(--color-accent));
}

a {
  text-decoration: none;
  color: rgba(var(--color-accent, 0.7));
  transition: .3s;
}
a:hover {
  color: rgb(var(--color-accent));
}

.container {
  width: var(--content-width);
  height: 600px;
  display: grid;
  grid-template-columns: 52px auto;
}

.sidebar {
  background-color: rgb(var(--sidebar-background));
  display: flex;
  flex-flow: column;
  border-right: rgb(var(--color-accent)) medium inset;
}

.sidebar .avatar img {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: block;
  margin: 6px auto;
  object-fit: cover;
}

.navigation {
  display: flex;
  flex-flow: column;
}

.anilist-logo {
  margin-top: auto;
}

.anilist-logo img {
  width: 100%;
}
</style>
