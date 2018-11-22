const clientId = 1387;
const redirectUri = chrome.identity.getRedirectURL("oauth");
const authUrl = "https://anilist.co/api/v2/oauth/authorize?client_id=" + clientId + "&response_type=token";

function beginAuthorizationFlow() {
  console.log("Beginning AniList authentication");
  chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, redirect_url => {
    if (chrome.runtime.lastError) {
      console.debug(chrome.runtime.lastError);
    } else {
      console.log("Authentication code recieved, trading for token.")
      let token = redirect_url.split("#")[1].split("&")[0].split("=")[1];
      handleToken(token);
    }
  });
}

function handleToken(token) {
  chrome.storage.local.set({ access_token: token });
  console.log("Token obtained and stored.");

  console.log("Requesting basic user information.");
  fetch("../graphql/viewer.graphql").then(query => query.text()).then(query => {
    queryAL(query, {}, token).then(viewerRes => viewerRes.json())
    .then(viewerRes => viewerRes.data.Viewer)
    .then(viewerRes => {
      chrome.storage.local.set({ user_info: { name: viewerRes.name, id: viewerRes.id, site_url: viewerRes.siteUrl, avatar: viewerRes.avatar.large } });
      chrome.runtime.sendMessage({ type: "change_avatar", avatar: viewerRes.avatar.large });
      chrome.runtime.sendMessage({ type: "change_page", page: "medialist" });
    });
  });
}
