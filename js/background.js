chrome.runtime.onInstalled.addListener(() => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command === "start_oauth") {
      console.log("Beginning AniList authentication");
      var client_id = "1299";
      var redirectUri = chrome.identity.getRedirectURL("oauth");
      var auth_url = "https://anilist.co/api/v2/oauth/authorize?client_id=" + client_id + "&redirect_uri=" + redirectUri + "&response_type=code";
      chrome.identity.launchWebAuthFlow({
        "url": auth_url,
        "interactive": true
      }, redirect_url => {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError.message);
        } else {
          console.log("Authentication code recieved, trading for token.")
          tradeForToken(redirect_url.slice(redirect_url.indexOf("=") + 1, redirect_url.length));
        }
      });
    }
  });

  checkForNotifications();
  chrome.alarms.create("notification_updater", { delayInMinutes: 1, periodInMinutes: 1 });
  chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === "notification_updater")
      checkForNotifications();
  });
});

function tradeForToken(oAuthCode) {
  fetch("https://anilist.co/api/v2/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: "1299",
      client_secret: "e7qcv8eDlB8tSo7ShzTMcKKKj988MsczIKeQLi7d", // FIXME: Need to query remote to mask this secret
      redirect_uri: chrome.identity.getRedirectURL("oauth"),
      code: oAuthCode,
    })
  }).then(res => res.json()).then(res => {
    chrome.storage.local.set({
      access_token: res.access_token,
      refresh_token: res.refresh_token
    }, ret => {});
    window.close();
  });
}

function checkForNotifications() {
  chrome.storage.local.get({ access_token: "" }, value => {
    if (value.access_token === "")
      return;

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
      if (count > 0)
        chrome.browserAction.setBadgeText({ text: text.toString() });
    });
  });
}
