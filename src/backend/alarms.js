const browser = require("webextension-polyfill");
import notificationQuery from "../assets/graphql/notifications.graphql";
import {queryAL} from "../assets/js/utils";

browser.runtime.onStartup.addListener(startup);
browser.runtime.onInstalled.addListener(startup);

browser.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "notification_updater") {
    browser.storage.local.get({ notifications: { enabled: true } }).then(value => {
      if (value.notifications.enabled)
        checkForNotifications();
    })
  }
});

browser.runtime.onMessage.addListener(message => {
  if (message.type === "modify-alarm")
    modifyAlarmTime(message.alarm.name, message.alarm.interval);
});

if (browser.notifications) {
  browser.notifications.onClicked.addListener(notification => {
    if (notification.startsWith("https://anilist.co/"))
      window.open(notification);

    if (notification === "unknown")
      window.open("https://github.com/TehNut/AniMouto/issues");
  });
}

function checkForNotifications() {
  browser.storage.local.get({ access_token: "", currentNotifications: 0, notifications: { hideLikes: false } }).then(value => {
    if (value.access_token === "")
      return;

    console.debug("Checking for new notifications");
    queryAL("{Viewer{unreadNotificationCount}}", {}, value.access_token).then(res => {
      if (!res.data || !res.data.Viewer)
        return;

      let lastCheck = value.currentNotifications;
      let count = res.data.Viewer.unreadNotificationCount;
      console.debug("Found " + count + " unread notification(s)");
      browser.runtime.sendMessage({ type: "update_notifications", notification_count: count }).catch(() => {});
      browser.browserAction.setBadgeText({ text: count > 0 ? count.toString() : "" });
      browser.browserAction.setBadgeBackgroundColor({ color: [61, 180, 242, Math.floor(255 * 0.8)] });

      if (count > 0 && count - lastCheck > 0)
        handleDesktopNotifications(count - lastCheck, value.access_token, value.notifications.hideLikes);

      return count;
    }).then(count => browser.storage.local.set({ currentNotifications: count }));
  });
}

function startup() {
  browser.storage.local.get({ notifications: { interval: 1, enabled: true, desktop: false } }).then(value => {
    modifyAlarmTime("notification_updater", value.notifications.interval);
    if (value.notifications.enabled)
      checkForNotifications(); // Initial check to account for 1m delay
  });
}

function modifyAlarmTime(name, time) {
  console.debug("Set alarm " + name + " to an interval of " + time + " minutes");
  browser.alarms.clear(name);
  browser.alarms.create(name, { delayInMinutes: time, periodInMinutes: time });
}

function handleDesktopNotifications(amount, token, hideLikes) {
  queryAL(notificationQuery, { amount: amount, reset: false }, token).then(res => {
    res.data.Page.notifications.forEach(notification => {
      if (hideLikes && notification.type.endsWith("_LIKE"))
        return;

      switch (notification.type) {
        case "ACTIVITY_LIKE":
        case "ACTIVITY_MENTION":
        case "ACTIVITY_REPLY":
        case "ACTIVITY_REPLY_LIKE":
        case "ACTIVITY_REPLY_SUBSCRIBED": {
          createNotification(notification.activity ? notification.activity.url : notification.user.url, notification.user.img.large, "New Activity", notification.user.name + notification.context);
          break;
        }
        case "ACTIVITY_MESSAGE": {
          createNotification(`https://anilist.co/activity/${notification.activityId}`, notification.user.img.large, "New Message", notification.user.name + notification.context);
          break;
        }
        case "AIRING":
        case "RELATED_MEDIA_ADDITION": {
          createNotification(notification.media.url, notification.media.img.large, "New Episode", notification.contexts[0] + notification.episode + notification.contexts[1] + notification.media.title.userPreferred + notification.contexts[2]);
          break;
        }
        case "FOLLOWING": {
          createNotification(notification.activity ? notification.activity.url : notification.user.url, notification.user.img.large, "New Follower", notification.user.name + notification.context);
          break;
        }
        case "THREAD_COMMENT_LIKE":
        case "THREAD_COMMENT_MENTION":
        case "THREAD_COMMENT_REPLY":
        case "THREAD_LIKE":
        case "THREAD_SUBSCRIBED": {
          createNotification(notification.thread.url + "/comment/" + notification.commentId, notification.user.img.large, "New Forum Activity", notification.user.name + notification.context + notification.thread.title);
          break;
        }
        default: {
          browser.notifications.create("unknown", {
            type: "basic",
            iconUrl: "https://anilist.co/img/logo_al.png",
            title: "Unknown notification",
            message: "This is an unknown notification type. Please report this so it can have support added."
          });
        }
      }
    });

    function createNotification(id, icon, title, message) {
      browser.notifications.create(id, {
        type: "basic",
        iconUrl: icon,
        title: title,
        message: message
      });
    }
  });
}
