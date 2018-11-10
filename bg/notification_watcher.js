chrome.alarms.create("notification_updater", { delayInMinutes: 1, periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "notification_updater")
    checkForNotifications();
});

function checkForNotifications() {
  chrome.storage.local.get({ access_token: "" }, value => {
    if (value.access_token === "")
      return;

    console.debug("Checking for new notifications")
    fetch("https://graphql.anilist.co/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + value.access_token
      },
      body: JSON.stringify({ query: "{Viewer{unreadNotificationCount}}" })
    }).then(res => res.json()).then(res => {
      let count = res.data.Viewer.unreadNotificationCount;
      console.debug("Found " + count + " new notification(s)");
      chrome.runtime.sendMessage({ type: "update_notifications", notification_count: count });
      chrome.browserAction.setBadgeText({ text: count > 0 ? count.toString() : "" });
      chrome.browserAction.setBadgeBackgroundColor({ color: [61, 180, 242, Math.floor(255 * 0.8)] }, () => {});
    });
  });
}
