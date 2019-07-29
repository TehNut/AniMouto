<template>
  <div :class="'section notification' + (unread ? ' unread' : '')" @click="unread = false">
    <slot/>
    <a class="notification-time">{{ formatTime() }}</a>
  </div>
</template>

<script>
  import {formatTimeShort} from "../../../assets/js/utils";

  export default {
    name: "Notification",
    props: [
      "unread",
      "notification"
    ],
    methods: {
      formatTime() {
        return formatTimeShort(Math.abs(this.notification.createdAt - Date.now() / 1000));
      },
      listify(users) {
        switch (users.length) {
          case 1: return `<a href="${users[0].url}" class="highlight" target="_blank">${users[0].name}</a>`;
          case 2: return `<a href="${users[0].url}" class="highlight" target="_blank">${users[0].name}</a> and <a href="${users[1].url}" class="highlight" target="_blank">${users[1].name}</a>`;
          case 3: return `<a href="${users[0].url}" class="highlight" target="_blank">${users[0].name}</a>, <a href="${users[1].url}" class="highlight" target="_blank">${users[1].name}</a>, and <a href="${users[2].url}" class="highlight" target="_blank">${users[2].name}</a>`;
          default: return `<a href="${users[0].url}" class="highlight" target="_blank">${users[0].name}</a>, <a href="${users[1].url}" class="highlight" target="_blank">${users[1].name}</a>, and ${users.length - 2} others`
        }
      }
    }
  }
</script>

<style>
  .notification {
    height: 50px;
    padding: 10px;
    margin-bottom: 10px;
    color: rgb(var(--color-text));
    font-size: 1.2em;
    display: flex;
    overflow: hidden;
  }

  .body-container {
    width: 330px;
    height: 70px;
    padding-left: 60px;
    display: inline-block;
  }

  .notification-body {

  }

  .notification-time {
    color: rgb(var(--color-text-lighter));
    font-size: 0.75rem;
    right: 20px;
    position: absolute;
  }

  .unread {
    border-right: rgb(var(--color-accent)) medium inset;
  }

  .notification-icon {
    border-radius: 50%;
    width: 45px;
    height: 45px;
    position: absolute;
    object-fit: cover;
  }

  .bonus-people {
    position: absolute;
    left: 48px;
    margin-top: 30px;
    width: 20px;
    height: 20px;
    border: 2px solid rgb(var(--color-foreground));
    border-radius: 50%;
    background-color: rgb(var(--color-accent));
    font-size: 10px;
    line-height: 20px;
    text-align: center;
    color: rgb(var(--color-text-bright));
    pointer-events: none;
  }
</style>
