<template>
  <div>
    <a :href="notification.media.url" target="_blank">
      <img class="avatar notification-icon no-select" :src="notification.media.img.large">
    </a>
    <a :href="notification.media.url" class="body-container" target="_blank">
      <div v-if="notification.contexts" class="notification-body">
        {{ notification.contexts[0] + notification.episode + notification.contexts[1]}}<span class="highlight">{{ notification.media.title.userPreferred }}</span> {{ notification.contexts[2] }}
      </div>
      <div v-else class="notification-body">
        <span class="highlight">{{ notification.media.title.userPreferred }}</span> {{ notification.context }}
      </div>
    </a>
  </div>
</template>

<script>

  export default {
    name: "AiringNotification",
    props: [
      "notification"
    ]
  }
</script>
