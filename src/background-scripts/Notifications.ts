import { browser } from "webextension-polyfill-ts";
import { Notification, NotificationType } from "@/models/Notifcation";
import { MessageType, queryAniList } from './Background';
import languageLookup, { SupportedLanguages, formatHandlebars } from "@/i18n/Lookup";

// Initialize alarms on startup/installation
browser.runtime.onStartup.addListener(setupAlarms);
browser.runtime.onInstalled.addListener(setupAlarms);

// Listen for settings changes and reset alarms with new values
browser.runtime.onMessage.addListener(async message => {
  if (message !== MessageType.RESET_ALARMS)
    return;

  await setupAlarms();
});

// Listen for alarms to be fired
browser.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name !== "notifications")
    return;

  await checkForNotifications();
});

browser.notifications.onClicked.addListener(id => {
  if (id.startsWith("https://anilist.co/"))
    window.open(id);
    
  if (id === "unknown")
    window.open("https://github.com/TehNut/AniMouto");
});

type NotificationSettings = {
  notificationPolling: boolean;
  pollingInterval: number;
  desktopNotifications: boolean;
};

type NotificationResponse = {
  pageInfo: {
    hasNextPage: boolean;
  };
  notifications: Notification[];
}

const defaultSettings: NotificationSettings = {
  notificationPolling: true,
  pollingInterval: 1,
  desktopNotifications: false
};

async function setupAlarms() {
  const storage: { token: string, settings: NotificationSettings } = await browser.storage.local.get({ token: "", settings: defaultSettings }) as { token: string, settings: NotificationSettings };
  await browser.alarms.clearAll();

  if (storage.token && storage.settings.notificationPolling)
    browser.alarms.create("notifications", { delayInMinutes: storage.settings.pollingInterval, periodInMinutes: storage.settings.pollingInterval })
  
  checkForNotifications();
}

async function checkForNotifications() {
  const { token, unreadNotificationCount: currentCount }: { token: string, unreadNotificationCount: number } = await browser.storage.local.get() as { token: string, unreadNotificationCount: number };
  const response: { Viewer: { unreadNotificationCount: number } } = await queryAniList(token, "{ Viewer { unreadNotificationCount } }").then(res => res.data);

  await browser.browserAction.setBadgeText({ text: response.Viewer.unreadNotificationCount ? response.Viewer.unreadNotificationCount.toString() : "" });
  await browser.browserAction.setBadgeBackgroundColor({ color: [61, 180, 242, Math.floor(255 * 0.8)] });

  if (response.Viewer.unreadNotificationCount > 0 && response.Viewer.unreadNotificationCount - currentCount > 0)
    handleDesktopNotifications(response.Viewer.unreadNotificationCount - currentCount);

  await browser.storage.local.set({ unreadNotificationCount: response.Viewer.unreadNotificationCount });
}

async function handleDesktopNotifications(newNotifications: number) {
  if (!(await browser.permissions.contains({ permissions: [ "notifications" ] })))
    return;

  const { token, language }: { token: string, language: SupportedLanguages } = await browser.storage.local.get({ token: "", language: "ENGLISH" }) as { token: string, language: SupportedLanguages };

  const maxPage = Math.ceil(newNotifications / 50);

  async function handlePage(page: number, perPage?: number) {
    const notifications: NotificationResponse = (await queryAniList(token, notificationQuery, { amount: perPage || 50, page }).then(res => res.data.Page)) as NotificationResponse;

    const lang = languageLookup(language);
    notifications.notifications.forEach(notification => {
      switch(notification.type) {
        case NotificationType.ACTIVITY_LIKE:
        case NotificationType.ACTIVITY_MENTION:
        case NotificationType.ACTIVITY_REPLY:
        case NotificationType.ACTIVITY_REPLY_LIKE:
        case NotificationType.ACTIVITY_REPLY_SUBSCRIBED: {
          createNotification(lang, notification.activity ? notification.activity.url : notification.user!.url, "activity", notification.type, { user: notification.user!.name });
          break;
        }
        case NotificationType.ACTIVITY_MESSAGE: {
          createNotification(lang, `https://anilist.co/activity/${notification.activityId}`, "message", notification.type, { user: notification.user!.name });
          break;
        }
        case NotificationType.AIRING: {
          createNotification(lang, notification.media!.url, "episode", notification.type, { episode: notification.episode, media: notification.media?.title?.userPreferred });
          break;
        }
        case NotificationType.RELATED_MEDIA_ADDITION: {
          createNotification(lang, notification.media!.url, "relation", notification.type, { media: notification.media?.title?.userPreferred });
          break;
        }
        case NotificationType.FOLLOWING: {
          createNotification(lang, notification.activity ? notification.activity.url : notification.user!.url, "follower", notification.type, { user: notification.user!.name });
          break;
        }
        case NotificationType.THREAD_COMMENT_LIKE:
        case NotificationType.THREAD_COMMENT_MENTION:
        case NotificationType.THREAD_COMMENT_REPLY:
        case NotificationType.THREAD_LIKE:
        case NotificationType.THREAD_SUBSCRIBED: {
          createNotification(lang, notification.thread!.url + "/comment/" + notification.commentId, "forum", notification.type, {user: notification.user!.name, thread: notification.thread!.title });
          break;
        }
        default: {
          createNotification(lang, "unknown", "unknown", null);
        }
      }
    });

    if (page < maxPage && false) // TODO fix this garbage, popular people can fuck off for now
      await handlePage(page + 1, maxPage - page === 1 ? newNotifications - (50 * page) : undefined);
  }

  await handlePage(1, newNotifications);
}

function createNotification(language: any, id: string, titleType: string, type: NotificationType | null, message?: any) {
  if (!type) {
    browser.notifications.create(id, {
      type: "basic",
      iconUrl: "img/animouto_128x.png",
      title: language.notifications.unknown,
      message: language.notifications.unknown_type
    });
  } else {
    browser.notifications.create(id, {
      type: "basic",
      iconUrl: "img/animouto_128x.png",
      title: language.notifications[`new_${titleType}`],
      message: formatHandlebars(language.notifications[type.toLowerCase()], message)
    });
  }
}

// String so we don't need to embed the GQL libraries in the background scripts
const notificationQuery = "query($amount: Int, $page: Int) { Page(perPage: $amount, page: $page) { notifications(resetNotificationCount: false) { ... on ActivityLikeNotification { id activityId user { ...user } activity { ...activity } context createdAt type } ... on ActivityMentionNotification { id activityId user { ...user } activity { ...activity } context createdAt type } ... on ActivityMessageNotification { id activityId user { ...user } activity: message { url: siteUrl } activityId context createdAt type } ... on ActivityReplyLikeNotification { id activityId user { ...user } activity { ...activity } context createdAt type } ... on ActivityReplyNotification { id activityId user { ...user } activity { ...activity } context createdAt type } ... on ActivityLikeNotification { id activityId user { ...user } activity { ...activity } context createdAt type } ... on ActivityReplySubscribedNotification { id activityId user { ...user } activity { ...activity } context createdAt type } ... on AiringNotification { id media { ...media } episode contexts createdAt type } ... on RelatedMediaAdditionNotification { id media { ...media } context createdAt type } ... on FollowingNotification { id user { ...user } context createdAt type } ... on ThreadCommentLikeNotification { id thread { ...thread } user { ...user } commentId context createdAt type } ... on ThreadCommentMentionNotification { id thread { ...thread } user { ...user } commentId context createdAt type } ... on ThreadCommentReplyNotification { id thread { ...thread } user { ...user } commentId context createdAt type } ... on ThreadCommentSubscribedNotification { id thread { ...thread } user { ...user } commentId context createdAt type } ... on ThreadLikeNotification { id thread { ...thread } user { ...user } context createdAt type } } } } fragment media on Media { title { userPreferred } url: siteUrl } fragment user on User { name url: siteUrl } fragment thread on Thread { title url: siteUrl } fragment activity on ActivityUnion { __typename ... on TextActivity { url: siteUrl } ... on ListActivity { url: siteUrl } ... on MessageActivity { url: siteUrl } }"