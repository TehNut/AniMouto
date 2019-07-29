<template>
  <div>
    <a :href="notification.user.url" target="_blank">
      <img class="avatar notification-icon no-select" :src="notification.user.img.large">
      <span v-if="notification.users && notification.users.length > 1" class="bonus-people">+{{ notification.users.length - 1 }}</span>
    </a>
    <a :href="getUrl()" class="body-container" target="_blank">
      <div class="notification-body">
        <span v-if="!notification.users">
          <a :href="notification.user.url" class="highlight" target="_blank">{{ notification.user.name }}</a>
        </span>
        <span v-else v-html="$parent.listify(notification.users)"></span>
        {{ notification.context }}
      </div>
    </a>
  </div>
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
