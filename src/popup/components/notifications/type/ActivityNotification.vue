<template>
  <span>
    <a :href="notification.user.url" target="_blank">
      <img class="avatar notification-icon no-select" :src="notification.user.img.large">
    </a>
    <a :href="notification.activity ? notification.activity.url : notification.user.url" class="notification-body" target="_blank">
      <span class="highlight">{{ notification.user.name }}</span> {{ notification.context }}
    </a>
  </span>
</template>

<script>
  export default {
    name: "ActivityNotification",
    props: [
      "notification"
    ]
  }
</script>
