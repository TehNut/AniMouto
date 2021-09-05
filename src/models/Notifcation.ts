export interface Notification {
  id:          number;
  activityId?: number;
  user?:       Media;
  activity?:   { url: string };
  context?:    string;
  createdAt:   number;
  type:        NotificationType;
  media?:      Media;
  episode?:    number;
  contexts?:   string[];
  thread?:     Thread;
  commentId?:  number;
}

export interface Media {
  title?:     { userPreferred: string };
  img:        { large: string };
  url:        string;
  name?:      string;
}

export interface Thread {
  title:      string;
  url:        string;
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