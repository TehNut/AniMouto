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
      });
  });
}

function modifyAlarmTime(name, time) {
  console.log("Set alarm " + name + " to an interval of " + time + " minutes")
  chrome.alarms.clear(name);
  chrome.alarms.create(name, { delayInMinutes: time, periodInMinutes: time });
}
