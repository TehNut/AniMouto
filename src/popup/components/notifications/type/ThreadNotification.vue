<template>
  <div>
    <a :href="notif.user.url" target="_blank">
      <img class="avatar notification-icon no-select" :src="notif.user.img.large" ref="avatar">
      <span v-if="notif.users && notif.users.length > 1" class="bonus-people">+{{ notif.users.length - 1 }}</span>
    </a>
    <a
      :href="notif.thread.url !== '#' ? notif.thread.url + (notif.commentId ? '/comment/' + notif.commentId : '') : ''"
      class="body-container"
      :target="notif.thread.url === '#' ? '' : '_blank'"
      @click="notif.thread.url === '#' ? $event.preventDefault() : ''"
    >
      <div class="notification-body">
        <span v-if="!notif.users">
          <a :href="notif.user.url" class="highlight" target="_blank">{{ notif.user.name }}</a>
        </span>
        <span v-else v-html="$parent.listify(notif.users)"></span>
        {{ notif.context }} <span class="highlight">{{ notif.thread.title }}</span>
      </div>
    </a>
  </div>
</template>

<script>
  export default {
    name: "ThreadNotification",
    data() {
      return {
        notif: null,
      }
    },
    props: [
      "notification"
    ],
    created() {
      this.notif = this.notification;
      if (!this.notif.thread)
        this.notif.thread = { title: "Deleted Thread", url: "#" }
    }
  }
</script>
