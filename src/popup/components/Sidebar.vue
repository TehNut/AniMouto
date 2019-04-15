<template>
  <div class="sidebar theme-dark">
    <div class="avatar" ref="avatar">
      <a id="user-avatar-link" href="#" target="_blank">
        <img id="user-avatar" src="#">
      </a>
    </div>
    <div class="navigation no-select">
      <div v-for="page in pages" style="cursor:hover;" :id="page.id">
        <i class="material-icons page-icon" @click="changePage(page)">{{ page.icon ? page.icon : page.id }}</i>
      </div>
    </div>
    <a href="https://anilist.co/" target="_blank"><img class="anilist-icon" src="../../assets/img/anilist.svg" /></a>
  </div>
</template>

<script>
  import {updateUser} from "../../assets/js/utils";

  export default {
    name: "Sidebar",
    data() {
      return {
        pages: {
          medialist: {
            id: "medialist",
            icon: "format_list_bulleted"
          },
          search: {
            id: "search"
          },
          forum: {
            id: "forum"
          },
          notifications: {
            id: "notifications",
            postHandle: function() {
              chrome.browserAction.getBadgeText({}, text => {
                if (text !== "" && parseInt(text) > 0)
                  updateNotifications(parseInt(text));
              });
            }
          },
          settings: {
            id: "settings"
          },
          about: {
            id: "about",
            icon: "info"
          },
          login: {
            id: "login"
          }
        }
      }
    },
    created() {
      updateUser();
    },
    methods: {
      changePage(page) {
        this.$router.push(page.id);
        chrome.storage.local.set({ last_page: page.id });
        if (page.postHandle)
          page.postHandle();
      },
    }
  }
</script>

<style scoped>
  .sidebar {
    height: 100%;
    width: 52px;
    float: left;
    position: fixed;
    background-color: rgb(var(--color-foreground));
    border-right: rgb(var(--color-accent)) medium inset;
    color: rgb(var(--color-text));
  }

  .avatar img {
    position: inherit;
    width: 90%;
    border-radius: 50%;
    margin-left: 2px;
    margin-bottom: 6px;
    margin-top: 6px;
    object-fit: cover;
  }

  .page-icon {
    padding: 2px 13px 2px 13px;
    margin-bottom: 4px;
    cursor: pointer;
    transition: .3s;
  }

  .page-icon:hover {
    color: rgb(var(--color-accent));
  }

  .anilist-icon {
    width: 100%;
    bottom: 0;
    position: absolute;
  }
</style>
