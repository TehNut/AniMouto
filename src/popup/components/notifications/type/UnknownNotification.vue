<template>
  <span>
    <i class="material-icons avatar notification-icon no-select">notification_important</i>
    <a href="https://github.com/TehNut/AniMouto/issues" class="notification-body" target="_blank" :title="JSON.stringify(notification)">
      This is an <span style="color:rgb(var(--color-red))">unknown</span> notification type. Please report this so it can have support added.
    </a>
  </span>
</template>

<script>
  export default {
    name: "UnknownNotification",
    props: [
      "notification"
    ]
  }
</script>

<style scoped>
  .notification-icon {
    font-size: 40px;
    margin-top: 6px;
  }
</style>
