<template>
  <span>
    <a :href="notification.user.url" target="_blank">
      <img class="avatar notification-icon no-select" :src="notification.user.img.large">
    </a>
    <a :href="notification.thread.url + (notification.commentId ? '/comment/' + notification.commentId : '')" class="notification-body" target="_blank">
      <div>
        <a :href="notification.user.url" class="highlight" target="_blank">{{ notification.user.name }}</a> {{ notification.context }} <span class="highlight">{{ notification.thread.title }}</span>
      </div>
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
