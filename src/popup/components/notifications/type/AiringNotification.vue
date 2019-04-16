<template>
  <span>
    <a :href="notification.media.url" target="_blank">
      <img class="avatar notification-icon no-select" :src="notification.media.img.large">
    </a>
    <a :href="notification.media.url" class="notification-body" target="_blank">
      {{ notification.contexts[0] + notification.episode + notification.contexts[1]}}<span class="highlight">{{ notification.media.title.userPreferred }}</span> {{ notification.contexts[2] }}
    </a>
  </span>
</template>

<script>

  export default {
    name: "AiringNotification",
    props: [
      "notification"
    ]
  }
</script>
