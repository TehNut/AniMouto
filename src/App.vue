<template>
  <div 
    id="app" 
    :class="{ 
      wide,
      'theme-light': theme === 'light', 
      'theme-dark': theme === 'dark', 
      'theme-contrast-dark': theme === 'contrast-dark', 
      'theme-contrast': theme === 'contrast', 
    }"
    :style="{ '--color-accent': `var(--color-${accent})` }"
  >
    <div class="container">
      <div class="theme-dark sidebar">
        <div class="avatar">
          <a :href="user.siteUrl" target="_blank">
            <img :src="user.avatar.large">
          </a>
        </div>
        <br>
        <div class="navigation">
          <navigation-icon page="list" icon="list"/>
          <navigation-icon page="search" icon="search"/>
          <navigation-icon page="notifications" icon="bell">
            <div v-if="unreadNotificationCount > 0" class="notification-alert">{{ unreadNotificationCount }}</div>
          </navigation-icon>
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
import { Settings } from './models/Settings';

const root = namespace("root");
const settings = namespace("settings");
const user = namespace("user");

@Component({
  components: {
    NavigationIcon
  }
})
export default class App extends Vue {
  @root.Getter
  lastPage!: string;

  @settings.Getter
  theme!: string;

  @settings.Getter
  accent!: string;

  @settings.Getter
  wide!: boolean;

  @user.Getter
  user!: AniListUser;

  @user.Getter
  loggedIn!: boolean;

  @root.Getter
  unreadNotificationCount: number = 0;

  async created() {
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
@import url("assets/utility.css");

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
  background-color: rgb(var(--color-background));
  color: rgb(var(--color-text));
  width: var(--content-width);
  height: 600px;
  display: grid;
  grid-template-columns: 52px auto;
}

.wide {
  --content-width: 716px;
}

.sidebar {
  background-color: rgb(var(--sidebar-background));
  display: flex;
  flex-flow: column;
  border-right: rgb(var(--color-accent)) medium inset;
  user-select: none;
}

.sidebar .avatar img {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: block;
  margin: 6px auto;
  object-fit: cover;
}

.content {
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 20px 10px 10px;
}

.navigation {
  display: flex;
  flex-flow: column;
}

.notification-alert {
  position: absolute;
  right: 2px;
  margin-top: -22px;
  width: 20px;
  height: 20px;
  border: 2px solid rgb(var(--sidebar-background));
  border-radius: 50%;
  background-color: rgb(var(--color-red));
  font-size: 10px;
  line-height: 20px;
  text-align: center;
  color: rgb(var(--color-text-bright));
  pointer-events: none;
}

.anilist-logo {
  margin-top: auto;
}

.anilist-logo img {
  width: 100%;
}
</style>
