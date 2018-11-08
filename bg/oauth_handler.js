// dev
const clientId = 1336, clientSecret = "MgQlEhAPKIijPCw25FIxldtuiIG2ilijbXuMvdJ1";
// live
// const clientId = 1299, clientSecret = "e7qcv8eDlB8tSo7ShzTMcKKKj988MsczIKeQLi7d";

const redirectUri = chrome.identity.getRedirectURL("oauth");
const authUrl = "https://anilist.co/api/v2/oauth/authorize?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&response_type=code";

function beginAuthorizationFlow() {
  console.log("Beginning AniList authentication");
  chrome.identity.launchWebAuthFlow({
    "url": authUrl,
    "interactive": true
  }, redirect_url => {
    if (chrome.runtime.lastError) {
      console.debug(chrome.runtime.lastError.message);
    } else {
      console.log("Authentication code recieved, trading for token.")
      tradeForToken(redirect_url.slice(redirect_url.indexOf("=") + 1, redirect_url.length));
    }
  });
}

function tradeForToken(oAuthCode) {
  fetch("https://anilist.co/api/v2/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: clientId.toString(),
      client_secret: clientSecret, // FIXME: Need to query remote to mask this secret
      redirect_uri: redirectUri,
      code: oAuthCode,
    })
  }).then(res => res.json()).then(res => {
    chrome.storage.local.set({
      access_token: res.access_token,
      refresh_token: res.refresh_token
    }, ret => {});
    console.log("Token obtained and stored.");

    console.log("Requesting basic user information.");
    fetch("https://graphql.anilist.co/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + res.access_token
        },
        body: JSON.stringify({ query: "{Viewer{name id siteUrl avatar{large}}}" })
      }).then(viewerRes => viewerRes.json())
      .then(viewerRes => viewerRes.data.Viewer)
      .then(viewerRes => {
        chrome.storage.local.set({ user_info: { name: viewerRes.name, id: viewerRes.id, site_url: viewerRes.siteUrl, avatar: viewerRes.avatar.large } });
      });
  });
}
