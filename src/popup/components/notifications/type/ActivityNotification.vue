<template>
  <span>
    <a :href="notification.user.url" target="_blank">
      <img class="avatar notification-icon no-select" :src="notification.user.img.large">
    </a>
    <a :href="getUrl()" class="notification-body" target="_blank">
      <div>
        <a :href="notification.user.url" class="highlight" target="_blank">{{ notification.user.name }}</a> {{ notification.context }}
      </div>
    </a>
  </span>
</template>

<script>
  export default {
    name: "ActivityNotification",
    props: [
      "notification"
    ],
    methods: {
      getUrl() {
        if (this.notification.activity)
          return this.notification.activity.url;

        if (this.notification.activityId)
          return `https://anilist.co/activity/${this.notification.activityId}`;

        return this.notification.user.url;
      }
    }
  }
</script>
