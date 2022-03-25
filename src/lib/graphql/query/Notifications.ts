import gql from "graphql-tag";

export const NotificationsQuery = gql`
  query($page: Int, $amount: Int, $reset: Boolean) {
    Viewer {
      unreadNotificationCount
    }
    Page(page: $page, perPage: $amount) {
      pageInfo {
        hasNextPage
      }
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
        ... on MediaDataChangeNotification {
          id
          media {
            ...media
          }
          context
          createdAt
          type
        }
        ... on MediaDeletionNotification {
          id
          deletedMediaTitle
          context
          createdAt
          type
        }
        ... on MediaMergeNotification {
          id
          media {
            ...media
          }
          deletedMediaTitles
          context
          createdAt
          type
        }
      }
    }
  }

  fragment media on Media {
    id
    title {
      userPreferred
    }
    img: coverImage {
      large
      color
    }
    url: siteUrl
  }

  fragment user on User {
    id
    name
    img: avatar {
      large
    }
    url: siteUrl
  }

  fragment thread on Thread {
    id
    title
    url: siteUrl
  }

  fragment activity on ActivityUnion {
    __typename
    ... on TextActivity {
      id
      url: siteUrl
    }
    ... on ListActivity {
      id
      url: siteUrl
    }
    ... on MessageActivity {
      id
      url: siteUrl
    }
  }
`;

export type NotificationsResult = {
  pageInfo: {
    hasNextPage: boolean
  }
  notifications: {
    id:          number;
    activityId?: number;
    user?:       {
      name: string
      img: {
        large: string
      }
      url: string
    };
    activity?:   { url: string };
    context?:    string;
    createdAt:   number;
    type:        NotificationType;
    media?:      {
      id: number
      title?:     { userPreferred: string };
      img:        { 
        large: string
        color: string
      };
      url:        string;
      name?:      string;
    };
    episode?:    number;
    contexts?:   string[];
    deletedMediaTitle?: string
    deletedMediaTitles?: string[]
    thread?:     {
      title:      string;
      url:        string;
    }
    commentId?:  number;
  }[]
}

export enum NotificationType {
  ACTIVITY_MESSAGE = "ACTIVITY_MESSAGE",
  ACTIVITY_REPLY = "ACTIVITY_REPLY",
  FOLLOWING = "FOLLOWING",
  ACTIVITY_MENTION = "ACTIVITY_MENTION",
  THREAD_COMMENT_MENTION = "THREAD_COMMENT_MENTION",
  THREAD_SUBSCRIBED = "THREAD_SUBSCRIBED",
  THREAD_COMMENT_REPLY = "THREAD_COMMENT_REPLY",
  AIRING = "AIRING",
  ACTIVITY_LIKE = "ACTIVITY_LIKE",
  ACTIVITY_REPLY_LIKE = "ACTIVITY_REPLY_LIKE",
  THREAD_LIKE = "THREAD_LIKE",
  THREAD_COMMENT_LIKE = "THREAD_COMMENT_LIKE",
  ACTIVITY_REPLY_SUBSCRIBED = "ACTIVITY_REPLY_SUBSCRIBED",
  RELATED_MEDIA_ADDITION = "RELATED_MEDIA_ADDITION",
  MEDIA_DATA_CHANGE = "MEDIA_DATA_CHANGE",
  MEDIA_DELETION = "MEDIA_DELETION",
  MEDIA_MERGE = "MEDIA_MERGE",
}