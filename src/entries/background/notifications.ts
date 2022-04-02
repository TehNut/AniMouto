import { runtime, storage, alarms, action, notifications, permissions } from "webextension-polyfill";
import { NotificationType } from "$lib/graphql";
import type { ExtensionConfiguration } from "$lib/model";
import { queryAniList } from "./main";

runtime.onInstalled.addListener(setupAlarms);
runtime.onStartup.addListener(setupAlarms);

notifications?.onClicked.addListener(handleNotificationClick);

function handleNotificationClick(id: string) {
  if (id.startsWith("https://anilist.co/"))
  window.open(id);
  
if (id === "unknown")
  window.open("https://github.com/TehNut/AniMouto"); // Maybe add a section to the readme about this
}

permissions.onAdded.addListener(permissions => {
  if (permissions.permissions?.includes("notifications") && !notifications?.onClicked.hasListeners())
  notifications.onClicked.addListener(handleNotificationClick)
})

export async function setupAlarms() {
  const { token, config } = await storage.local.get("config") as { token: string, config: ExtensionConfiguration };
  await alarms.clearAll();

  if (token && config.notifications.enablePolling)
    alarms.create("notifications", { delayInMinutes: config.notifications.pollingInterval, periodInMinutes: config.notifications.pollingInterval });
 
  checkForNotifications();
}

async function checkForNotifications() {
  const { token, unreadNotificationCount: currentCount } = await storage.local.get() as { token: string, unreadNotificationCount: number };
  if (!token)
    return;
  
  const response = await queryAniList<{ Viewer: { unreadNotificationCount: number } }>({ query: "{ Viewer { unreadNotificationCount } }", token }).then(res => res.data);

  await action.setBadgeText({ text: response.Viewer.unreadNotificationCount ? response.Viewer.unreadNotificationCount.toString() : "" });
  await action.setBadgeBackgroundColor({ color: [ 61, 180, 242, Math.floor(255 * 0.8) ] });

  if (response.Viewer.unreadNotificationCount > 0/* && response.Viewer.unreadNotificationCount - currentCount > 0 */)
    handleDesktopNotifications(response.Viewer.unreadNotificationCount/* - currentCount */);

  await storage.local.set({ unreadNotificationCount: response.Viewer.unreadNotificationCount });
}

async function handleDesktopNotifications(totalUnread: number) {
  if (!(await permissions.contains({ permissions: [ "notifications" ] })))
    return;

const { token } = await storage.local.get("token") as { token: string };
const maxPage = Math.ceil(totalUnread / 50);

async function handlePage(page: number, perPage?: number) {
  const { Page: { notifications } } = await queryAniList<{ Page: { notifications: any[] } }>({ token, query: notificationQuery, variables: { amount: perPage || 50, page }})
    .then(res => res.data);

  notifications.forEach(notification => {
    switch(notification.type) {
      case NotificationType.ACTIVITY_LIKE:
      case NotificationType.ACTIVITY_MENTION:
      case NotificationType.ACTIVITY_REPLY:
      case NotificationType.ACTIVITY_REPLY_LIKE:
      case NotificationType.ACTIVITY_REPLY_SUBSCRIBED: {
        createNotification(notification.activity ? notification.activity.url : notification.user!.url, "Activity", notification.type, { user: notification.user!.name });
        break;
      }
      case NotificationType.ACTIVITY_MESSAGE: {
        createNotification(`https://anilist.co/activity/${notification.activityId}`, "Message", notification.type, { user: notification.user!.name });
        break;
      }
      case NotificationType.AIRING: {
        createNotification(notification.media!.url, "Episode", notification.type, { episode: notification.episode, media: notification.media?.title?.userPreferred });
        break;
      }
      case NotificationType.RELATED_MEDIA_ADDITION: {
        createNotification(notification.media!.url, "Related Media", notification.type, { media: notification.media?.title?.userPreferred });
        break;
      }
      case NotificationType.FOLLOWING: {
        createNotification(notification.activity ? notification.activity.url : notification.user!.url, "Follower", notification.type, { user: notification.user!.name });
        break;
      }
      case NotificationType.THREAD_COMMENT_LIKE:
      case NotificationType.THREAD_COMMENT_MENTION:
      case NotificationType.THREAD_COMMENT_REPLY:
      case NotificationType.THREAD_LIKE:
      case NotificationType.THREAD_SUBSCRIBED: {
        createNotification(notification.thread!.url + "/comment/" + notification.commentId, "Forum Activity", notification.type, {user: notification.user!.name, thread: notification.thread!.title });
        break;
      }
      default: {
        createNotification("unknown", "unknown", null);
      }
    }
  });

  totalUnread -= notifications.length;
  if (page < maxPage)
    await handlePage(page + 1, totalUnread);
}

await handlePage(1, totalUnread);
}

const notificationContexts = {
  activity_like: "{user} liked your activity.",
  activity_mention: "{user} mentioned you in their activity.",
  activity_message: "{user} sent you a message.",
  activity_reply: "{user} replied to your activity.",
  activity_reply_like: "{user} liked your activity reply.",
  activity_reply_subscribed: "{user} replied to an activity you're subscribed to.",
  following: "{user} started following you.",
  airing: "Episode {episode} of {media} aired.",
  related_media_addition: "{media} was recently added to the site.",
  media_data_change: "{media} recieved site data changes.",
  media_deletion: "{deleted} was deleted from the site.",
  media_merge: "{merged} was merged into {media}.",
  thread_like: "{user} liked your forum thread, {thread}.",
  thread_subscribed: "{user} commented in your subscribed forum thread  {thread}.", 
  thread_comment_like: "{user} liked your comment, in the forum thread {thread}.",
  thread_comment_reply: "{user} replied to your comment, in the forum thread {thread}.",
  thread_comment_mention: "{user} mentioned you, in the forum thread {thread}.",
}

export function formatHandlebars(template: string, data?: any) {
  if (!data)
    return template;

  Object.entries(data).forEach(([k, v]) => {
    template = template.replace(new RegExp(`\{${k}\}`, "g"), v + "");
  });
  
  return template;
}

function createNotification(id: string, titleType: string, type?: NotificationType, message?: any) {
  if (!type) {
    notifications.create(id, {
      type: "basic",
      iconUrl: "icons/128.png",
      isClickable: true,
      title: "Unknown notification",
      message: "This is an unknown notification type! Please report this so it can be properly supported."

    });
  } else {
    notifications.create(id, {
      type: "basic",
      iconUrl: "icons/128.png",
      isClickable: true,
      title: `New ${titleType}`,
      message: formatHandlebars(notificationContexts[type.toLowerCase()], message)
    });
  }
}

const notificationQuery = "query($amount: Int, $page: Int) { Page(perPage: $amount, page: $page) { notifications(resetNotificationCount: false) { ... on ActivityLikeNotification { id activityId user { ...user } activity { ...activity } context createdAt type } ... on ActivityMentionNotification { id activityId user { ...user } activity { ...activity } context createdAt type } ... on ActivityMessageNotification { id activityId user { ...user } activity: message { url: siteUrl } activityId context createdAt type } ... on ActivityReplyLikeNotification { id activityId user { ...user } activity { ...activity } context createdAt type } ... on ActivityReplyNotification { id activityId user { ...user } activity { ...activity } context createdAt type } ... on ActivityLikeNotification { id activityId user { ...user } activity { ...activity } context createdAt type } ... on ActivityReplySubscribedNotification { id activityId user { ...user } activity { ...activity } context createdAt type } ... on AiringNotification { id media { ...media } episode contexts createdAt type } ... on RelatedMediaAdditionNotification { id media { ...media } context createdAt type } ... on FollowingNotification { id user { ...user } context createdAt type } ... on ThreadCommentLikeNotification { id thread { ...thread } user { ...user } commentId context createdAt type } ... on ThreadCommentMentionNotification { id thread { ...thread } user { ...user } commentId context createdAt type } ... on ThreadCommentReplyNotification { id thread { ...thread } user { ...user } commentId context createdAt type } ... on ThreadCommentSubscribedNotification { id thread { ...thread } user { ...user } commentId context createdAt type } ... on ThreadLikeNotification { id thread { ...thread } user { ...user } context createdAt type } } } } fragment media on Media { title { userPreferred } url: siteUrl } fragment user on User { name url: siteUrl } fragment thread on Thread { title url: siteUrl } fragment activity on ActivityUnion { __typename ... on TextActivity { url: siteUrl } ... on ListActivity { url: siteUrl } ... on MessageActivity { url: siteUrl } }";