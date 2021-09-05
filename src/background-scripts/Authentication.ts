import browser from "webextension-polyfill";

browser.runtime.onMessage.addListener(message => {
  if (message !== "START_AUTH")
    return;

  return browser.identity.launchWebAuthFlow({
    url: `https://anilist.co/api/v2/oauth/authorize?client_id=${process.env.VUE_APP_ANILIST_APP_ID}&response_type=token`,
    interactive: true,
  }).then(response => {
    const keyVal = response.split("#")[1].split("&");
    const token = keyVal[0].split("=")[1];
    return token;
  });
});