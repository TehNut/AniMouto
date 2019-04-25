<template>
  <div class="sidebar theme-dark">
    <div class="avatar" ref="avatar">
      <a id="user-avatar-link" href="#" target="_blank">
        <img id="user-avatar" src="#">
      </a>
    </div>
    <div class="navigation no-select">
      <div v-for="page in pages" :id="page.id" @click="changePage(page)">
        <i class="material-icons page-icon">{{ getIcon(page) }}</i>
        <div v-if="page.id === 'notifications' && unreadNotifications > 0" class="notification-text">
          {{ unreadNotifications > 99 ? "99+" : unreadNotifications }}
        </div>
      </div>
    </div>
    <a href="https://anilist.co/" target="_blank"><img class="anilist-icon" src="../../assets/img/anilist.svg" /></a>
  </div>
</template>

<script>
  import {updateUser} from "../../assets/js/utils";

  export default {
    name: "Sidebar",
    props: [
      "unreadNotifications"
    ],
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
          notifications: {
            id: "notifications"
          },
          forum: {
            id: "forum"
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
        const _self = this;
        chrome.storage.local.get({ access_token: "" }, value => {
          if (value.access_token === "")
            return;

          chrome.storage.local.set({ last_page: page.id });
          _self.$router.push("/" + page.id);
        });
      },
      getIcon(page) {
        if (page.id === "notifications" && this.unreadNotifications > 0)
          return "notifications_active";

        return page.icon ? page.icon : page.id;
      }
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

  .notification-text {
    position: absolute;
    right: 2px;
    margin-top: -22px;
    width: 20px;
    height: 20px;
    border: 2px solid rgb(var(--color-foreground));
    border-radius: 50%;
    background-color: rgb(var(--color-red));
    font-size: 10px;
    line-height: 20px;
    text-align: center;
    color: rgb(var(--color-text-bright));
    pointer-events: none;
  }
</style>
