chrome.storage.local.get({ notification_interval: 1 }, value => {
  modifyAlarmTime("notification_updater", value.notification_interval);
})
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "notification_updater") {
    chrome.storage.local.get({ notifications: { enabled: true } }, value => {
      if (value.notifications.enabled)
        checkForNotifications();
    })
  }
});

let lastCheck = 0;
function checkForNotifications() {
  chrome.storage.local.get({ access_token: "" }, value => {
    if (value.access_token === "")
      return;

    console.debug("Checking for new notifications")
    queryAL("{Viewer{unreadNotificationCount}}", {}, value.access_token)
      .then(res => res.json()).then(res => {
        let count = res.data.Viewer.unreadNotificationCount;
        console.debug("Found " + count + " new notification(s)");
        chrome.runtime.sendMessage({ type: "update_notifications", notification_count: count });
        chrome.browserAction.setBadgeText({ text: count > 0 ? count.toString() : "" });
        chrome.browserAction.setBadgeBackgroundColor({ color: [61, 180, 242, Math.floor(255 * 0.8)] }, () => {});

        if (count > 0 && count - lastCheck > 0)
          handleDesktopNotifications(count - lastCheck, value.access_token);

        lastCheck = count;
      });
  });
}

function modifyAlarmTime(name, time) {
  console.log("Set alarm " + name + " to an interval of " + time + " minutes")
  chrome.alarms.clear(name);
  chrome.alarms.create(name, { delayInMinutes: time, periodInMinutes: time });
}

function handleDesktopNotifications(amount, token) {
  fetch("../graphql/notifications.graphql").then(res => res.text()).then(res => {
    queryAL(res, { amount: amount, reset: false }, token).then(res => res.json()).then(res => res.data).then(res => {
      for (index in res.Page.notifications) {
        let notification = res.Page.notifications[index];
        if (notification.__typename.startsWith("Activity") || notification.__typename === "FollowingNotification")
          createNotification(notification.activity ? notification.activity.url : notification.user.url, notification.user.img.large, "New Activity", notification.user.name + notification.context);
        else if (notification.__typename === "AiringNotification")
          createNotification(notification.media.url, notification.media.img.large, "New Episode", notification.contexts[0] + notification.episode + notification.contexts[1] + notification.media.title.userPreferred + notification.contexts[2]);
        else if (notification.__typename.startsWith("ThreadComment"))
          createNotification(notification.thread.url + "/comment/" + notification.commentId, notification.user.img.large, "New Forum Activity", notification.user.name + notification.context + notification.thread.title);

        function createNotification(id, icon, title, message) {

          chrome.notifications.create(id, {
            type: "basic",
            iconUrl: icon,
            title: title,
            message: message
          });
        }
      }
    });
  });
}
