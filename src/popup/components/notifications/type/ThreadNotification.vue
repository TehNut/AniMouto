<template>
  <div>
    <a :href="notification.user.url" target="_blank">
      <img class="avatar notification-icon no-select" :src="notification.user.img.large" ref="avatar">
      <span v-if="notification.users && notification.users.length > 1" class="bonus-people">+{{ notification.users.length - 1 }}</span>
    </a>
    <a :href="notification.thread.url + (notification.commentId ? '/comment/' + notification.commentId : '')" class="body-container" target="_blank">
      <div class="notification-body">
        <span v-if="!notification.users">
          <a :href="notification.user.url" class="highlight" target="_blank">{{ notification.user.name }}</a>
        </span>
        <span v-else v-html="$parent.listify(notification.users)"></span>
        {{ notification.context }} <span class="highlight">{{ notification.thread.title }}</span>
      </div>
    </a>
  </div>
</template>

<script>
  export default {
    name: "ThreadNotification",
    props: [
      "notification"
    ],
    mounted() {
      if (!this.notification.users)
        return;

      setInterval(() => {

      }, 2000);
    }
  }
</script>
