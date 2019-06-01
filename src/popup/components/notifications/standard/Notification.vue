<template>
  <div :class="'section notification' + (unread ? ' unread' : '')" @click="unread = false">
    <slot/>
    <span class="notification-time">{{ formatTime() }}</span>
  </div>
</template>

<script>
  import {formatTimeShort} from "../../../../assets/js/utils";

  export default {
    name: "Notification",
    props: [
      "unread",
      "notification"
    ],
    methods: {
      formatTime() {
        return formatTimeShort(Math.abs(this.notification.createdAt - Date.now() / 1000));
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
  }

  .notification-body {
    max-width: 320px;
    margin-left: 60px;
    margin-top: 14px;
    display: inline-block;
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
</style>
