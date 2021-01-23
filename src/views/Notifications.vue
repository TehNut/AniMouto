<template>
  <div class="notifications-container">
    <Section v-if="!$apollo.queries.notifications.loading">
      <template #title>
        <div class="title-spacer">
          {{ $t("notifications.title") }}
          <fa-icon icon="redo" class="refresh" @click="$apollo.queries.notifications.refetch()" />
        </div>
      </template>
      <template #content>
        <Notification
          v-for="(notification, index) in notifications"
          :key="notification.id"
          :type="notification.type"
          :notification="notification"
          :unread="unreadCount > index"
        />
      </template>
    </Section>
    <Loader v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import gql from "graphql-tag";
import Loader from "@/components/Loader.vue";
import Section from "@/components/Section.vue";
import Notification from "@/components/Notification.vue";
import { Notification as NotificationObj } from "@/models/Notifcation";

const root = namespace("root");

@Component({
  components: {
    Loader,
    Section,
    Notification,
  },
  apollo: {
    notifications: {
      query: gql`
        query($amount: Int, $reset: Boolean) {
          Viewer {
            unreadNotificationCount
          }
          Page(perPage: $amount) {
            notifications(resetNotificationCount: $reset) {
              ... on ActivityLikeNotification {
                id
                activityId
                user {
                  ...user
                }
                activity {
                  ...activity
                }
                context
                createdAt
                type
              }
              ... on ActivityMentionNotification {
                id
                activityId
                user {
                  ...user
                }
                activity {
                  ...activity
                }
                context
                createdAt
                type
              }
              ... on ActivityMessageNotification {
                id
                activityId
                user {
                  ...user
                }
                activity: message {
                  url: siteUrl
                }
                activityId
                context
                createdAt
                type
              }
              ... on ActivityReplyLikeNotification {
                id
                activityId
                user {
                  ...user
                }
                activity {
                  ...activity
                }
                context
                createdAt
                type
              }
              ... on ActivityReplyNotification {
                id
                activityId
                user {
                  ...user
                }
                activity {
                  ...activity
                }
                context
                createdAt
                type
              }
              ... on ActivityLikeNotification {
                id
                activityId
                user {
                  ...user
                }
                activity {
                  ...activity
                }
                context
                createdAt
                type
              }
              ... on ActivityReplySubscribedNotification {
                id
                activityId
                user {
                  ...user
                }
                activity {
                  ...activity
                }
                context
                createdAt
                type
              }
              ... on AiringNotification {
                id
                media {
                  ...media
                }
                episode
                contexts
                createdAt
                type
              }
              ... on RelatedMediaAdditionNotification {
                id
                media {
                  ...media
                }
                context
                createdAt
                type
              }
              ... on FollowingNotification {
                id
                user {
                  ...user
                }
                context
                createdAt
                type
              }
              ... on ThreadCommentLikeNotification {
                id
                thread {
                  ...thread
                }
                user {
                  ...user
                }
                commentId
                context
                createdAt
                type
              }
              ... on ThreadCommentMentionNotification {
                id
                thread {
                  ...thread
                }
                user {
                  ...user
                }
                commentId
                context
                createdAt
                type
              }
              ... on ThreadCommentReplyNotification {
                id
                thread {
                  ...thread
                }
                user {
                  ...user
                }
                commentId
                context
                createdAt
                type
              }
              ... on ThreadCommentSubscribedNotification {
                id
                thread {
                  ...thread
                }
                user {
                  ...user
                }
                commentId
                context
                createdAt
                type
              }
              ... on ThreadLikeNotification {
                id
                thread {
                  ...thread
                }
                user {
                  ...user
                }
                context
                createdAt
                type
              }
            }
          }
        }

        fragment media on Media {
          title {
            userPreferred
          }
          img: coverImage {
            large
          }
          url: siteUrl
        }

        fragment user on User {
          name
          img: avatar {
            large
          }
          url: siteUrl
        }

        fragment thread on Thread {
          title
          url: siteUrl
        }

        fragment activity on ActivityUnion {
          __typename
          ... on TextActivity {
            url: siteUrl
          }
          ... on ListActivity {
            url: siteUrl
          }
          ... on MessageActivity {
            url: siteUrl
          }
        }
      `,
      variables() {
        return {
          amount: 50,
          reset: true
        }
      },
      update: data => data.Page.notifications,
      result({ data: { Viewer: { unreadNotificationCount }, Page: { notifications } } }) {
        this.notifications = notifications;
        this.unreadCount = unreadNotificationCount;
      }
    }
  }
})
export default class Notifications extends Vue {
  notifcations!: NotificationObj[];

  unreadCount!: number;

  @root.Action
  clearUnreadNotifications!: () => void;

  async mounted() {
    await this.clearUnreadNotifications();
  }
}
</script>

<style>
.title-spacer {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  margin-right: 20px;
}

.refresh {
  cursor: pointer;
  transition: .3s;
}

.refresh:hover {
  color: rgb(var(--color-accent));
}
</style>