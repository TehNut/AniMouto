<template>
  <div>
    <h1 class="section-title">Account</h1>
    <div class="section">
      <h2 class="title">Logged in as <a :href="user.url" class="highlight">{{ user.name }}</a></h2>
      <div class="button" @click="logout">Logout</div>
    </div>

    <h1 class="section-title">Theme</h1>
    <div class="section">
      <h2 class="title">Primary Scheme</h2>
      <div v-for="theme in themes" :title="theme.display" class="theme-preview no-select" :style="'background-color:' + theme.background + ';color:' + theme.color" @click="changeTheme(theme)">A</div>

      <br/>
      <br/>

      <h2 class="title">Accent Color</h2>
      <div class="accents">
        <div class="accent-button" v-for="accent in accents" :style="'background-color:rgb(var(--color-' + accent + '))'" @click="changeAccent(accent)"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {updateUser} from "../../assets/js/utils";

  export default {
    name: "Settings",
    data() {
      return {
        user: {
          name: "",
          url: ""
        },
        themes: [
          {
            name: "light",
            display: "Light",
            background: "rgb(237, 241, 245)",
            color: "rgb(92, 114, 138)"
          },
          {
            name: "dark",
            display: "Dark",
            background: "rgb(39, 44, 56)",
            color: "rgb(159, 173, 189)"
          },
          {
            name: "contrast",
            display: "High Contrast",
            background: "rgb(214, 224, 239)",
            color: "rgb(0, 0, 0)"
          }
        ],
        accents: [
          "blue",
          "red",
          "blue-dim",
          "peach",
          "orange",
          "yellow",
          "green"
        ]
      }
    },
    methods: {
      logout() {
        chrome.storage.local.clear();
        this.$router.push("login");
        updateUser();
      },
      changeTheme(theme) {
        chrome.storage.local.set({ theme: theme.name }, value => {});
        this.$emit("update-theme");
      },
      changeAccent(accent) {
        chrome.storage.local.set({ accent_color: "color-" + accent }, value => {});
        this.$emit("update-theme");
      }
    },
    created() {
      const _self = this;
      chrome.storage.local.get({ user_info: { name: "", site_url: "https://anilist.co" } }, value => {
        _self.user.name = value.user_info.name;
        _self.user.url = value.user_info.site_url;
      });
    }
  }
</script>

<style scoped>
  .theme-preview {
    display: inline-block;
    cursor: pointer;
    margin-right: 10px;
    width: 30px;
    height: 30px;
    text-indent: 3px;
    font-size: 1.2rem;
    border: solid 3px rgba(var(--color-accent), .8);
  }

  .accents {
    display: grid;
    grid-template-columns: repeat(auto-fill, 25px);
    grid-template-rows: repeat(auto-fill, 25px);
  }

  .accent-button {
    border-radius: 5px;
    border: 2px solid rgb(var(--color-background));
    width: 20px;
    height: 20px;
    cursor: pointer;
    transition: .1s;
  }

  .accent-button:hover {
    border-radius: 50%;
    border: 2px solid rgb(var(--color-text-light));
  }
</style>
