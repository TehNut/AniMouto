chrome.runtime.onStartup.addListener(startup);
chrome.runtime.onInstalled.addListener(startup);

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "notification_updater") {
    chrome.storage.local.get({ notifications: { enabled: true } }, value => {
      if (value.notifications.enabled)
        checkForNotifications();
    })
  }
});

if (chrome.notifications) {
  chrome.notifications.onClicked.addListener(notification => {
    if (notification.startsWith("https://anilist.co/"))
      window.open(notification);

    if (notification === "unknown")
      window.open("https://github.com/TehNut/AniMouto/issues");
  });
}

function checkForNotifications() {
  chrome.storage.local.get({ access_token: "", currentNotifications: 0, notifications: { hideLikes: false } }, value => {
    if (value.access_token === "")
      return;

    console.debug("Checking for new notifications");
    queryAL("{Viewer{unreadNotificationCount}}", {}, value.access_token)
      .then(res => res.json()).then(res => {
        let lastCheck = value.currentNotifications;
        let count = res.data.Viewer.unreadNotificationCount;
        console.debug("Found " + count + " unread notification(s)");
        chrome.runtime.sendMessage({ type: "update_notifications", notification_count: count });
        chrome.browserAction.setBadgeText({ text: count > 0 ? count.toString() : "" });
        chrome.browserAction.setBadgeBackgroundColor({ color: [61, 180, 242, Math.floor(255 * 0.8)] }, () => {});

        if (count > 0 && count - lastCheck > 0)
          handleDesktopNotifications(count - lastCheck, value.access_token, value.notifications.hideLikes);

        chrome.storage.local.set({ currentNotifications: count });
      });
  });
}

function startup() {
  chrome.storage.local.get({ notifications: { interval: 1, enabled: true, desktop: false } }, value => {
    modifyAlarmTime("notification_updater", value.notifications.interval);
    if (value.notifications.enabled)
      checkForNotifications(); // Initial check to account for 1m delay
  });
}

function modifyAlarmTime(name, time) {
  console.debug("Set alarm " + name + " to an interval of " + time + " minutes");
  chrome.alarms.clear(name);
  chrome.alarms.create(name, { delayInMinutes: time, periodInMinutes: time });
}

function handleDesktopNotifications(amount, token, hideLikes) {
  fetch("../assets/graphql/notifications.graphql").then(res => res.text()).then(res => {
    queryAL(res, { amount: amount, reset: false }, token).then(res => res.json()).then(res => res.data).then(res => {
      res.Page.notifications.forEach(notification => {
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
            chrome.notifications.create("unknown", {
              type: "basic",
              iconUrl: "https://anilist.co/img/logo_al.png",
              title: "Unknown notification",
              message: "This is an unknown notification type. Please report this so it can have support added."
            });
          }
        }
      });

      function createNotification(id, icon, title, message) {
        chrome.notifications.create(id, {
          type: "basic",
          iconUrl: icon,
          title: title,
          message: message
        });
      }
    });
  });
}
