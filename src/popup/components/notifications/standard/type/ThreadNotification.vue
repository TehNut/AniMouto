<template>
  <span>
    <a :href="notification.user.url" target="_blank">
      <img class="avatar notification-icon no-select" :src="notification.user.img.large">
    </a>
    <a :href="notification.thread.url + (notification.commentId ? '/comment/' + notification.commentId : '')" class="notification-body" target="_blank">
      <span class="highlight">{{ notification.user.name }}</span> {{ notification.context }} <span class="highlight">{{ notification.thread.title }}</span>
    </a>
  </span>
</template>

<script>
  export default {
    name: "ThreadNotification",
    props: [
      "notification"
    ]
  }
</script>
