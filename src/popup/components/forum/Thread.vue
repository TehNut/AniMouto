<template>
  <div class="section thread">
    <div class="thread-title">
      <a :href="thread.siteUrl" class="highlight-hover" target="_blank">{{ thread.title }}</a>
    </div>
    <br />
    <i18n path="forum.replied" tag="a" :href="thread.latest ? `${thread.siteUrl}/comment/${thread.latest}` : thread.siteUrl" class="highlight-hover" target="_blank">
      <template #user>
        <a :href="thread.replyUser.siteUrl" class="thread-commenter" target="_blank">
          <img :src="thread.replyUser.avatar.medium" class="avatar forum-avatar" />
          <span class="highlight">{{ thread.replyUser.name }}</span>
        </a>
      </template>
      <template #time>
        <span>{{ formatTime() }}</span>
      </template>
    </i18n>
    <span class="thread-info no-select">
      <i class="material-icons thread-icon">visibility</i><span class="highlight-hover">{{ thread.viewCount }}</span>
      <i class="material-icons thread-icon">message</i><span class="highlight-hover">{{ thread.replyCount}}</span>
    </span>
  </div>
</template>

<script>
  import {formatTimeShort} from "../../../assets/js/utils";

  export default {
    name: "Thread",
    props: [
      "thread"
    ],
    methods: {
      formatTime() {
        return formatTimeShort(Math.abs(this.thread.repliedAt - Date.now() / 1000))
      }
    }
  }
</script>

<style scoped>
  .thread {
    position: relative;
    margin-bottom: 10px;
    padding: 10px;
  }

  .thread-title {
    padding-top: 7px;
    font-size: 14px;
  }

  .thread-commenter {
    margin-top: 5px;
  }

  .forum-avatar {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    vertical-align: middle;
    object-fit: cover;
  }

  .thread-info {
    position: absolute;
    font-size: 9px;
    top: 5px;
    right: 5px;
  }

  .thread-icon {
    padding-right: 2px;
    font-size: 10px;
    vertical-align: bottom;
  }
</style>
