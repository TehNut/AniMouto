<template>
  <div class="container">
    <Messages/>
    <Sidebar/>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar";
import Messages from "./Messages";

export default {
  components: {Messages, Sidebar},
  data () {
    return {}
  },
  created() {
    chrome.storage.local.get({ theme: "light", accent_color: "color-blue", last_page: "login" }, value => {
      document.documentElement.style.setProperty("--color-accent", `var(--${value.accent_color})`);
      document.getElementsByTagName("body")[0].className = `theme-${value.theme}`;

      console.log(value.last_page)
      this.$router.push(value.last_page);
      // this.$router.push("login");
    });
  }
}
</script>

<style>
  @import url("../assets/css/main.css");
  @import url("../assets/css/font.css");
  @import url("../assets/css/form.css");
  @import url("../assets/css/theme.css");

  :root {
    /* Theme modifiable */
    --color-background: 237, 241, 245;
    --color-foreground: 250, 250, 250;
    --color-foreground-grey: 245, 246, 246;
    --color-foreground-grey-dark: 234, 236, 237;
    --color-foreground-blue: 246, 248, 251;
    --color-foreground-blue-dark: 241, 243, 247;
    --color-text: 92, 114, 138;
    --color-text-light: 122, 133, 143;
    --color-text-lighter: 146, 153, 161;
    /* No theming */
    --color-overlay: 31, 38, 49;
    --color-text-bright: 237, 241, 245;
    --color-blue: 61, 180, 242;
    --color-red: 232, 93, 117;
    --color-blue-dim: 141, 178, 219;
    --color-white: 255, 255, 255;
    --color-black: 0, 0, 0;
    --color-peach: 250, 122, 122;
    --color-orange: 247, 154, 99;
    --color-yellow: 247, 191, 99;
    --color-green: 123, 213, 85;
    /* Changeable option */
    --color-accent: var(--color-blue);
  }

  /* Global tag modifiers */
  body {
    line-height: 1.15;
    margin: 0;
    font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    -webkit-font-smoothing: antialiased;
    background-color: rgb(var(--color-background));
    font-size: 12px;
    color: rgb(var(--color-text));
  }

  a {
    text-decoration: none;
    color: rgb(var(--color-text));
    transition: .3s;
  }

  a:hover {
    color: rgb(var(--color-accent));
  }

  /* Chrome: Scroll bar */

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: rgb(var(--color-background));
  }

  ::-webkit-scrollbar-thumb {
    background: rgb(var(--color-accent));
  }

  .container {
    width: 525px;
    height: 600px;
  }

  .content {
    padding: 20px 10px 10px;
    width: 450px;
    float: right;
  }
</style>
