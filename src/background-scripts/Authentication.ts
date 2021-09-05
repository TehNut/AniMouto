import browser from "webextension-polyfill";

browser.runtime.onMessage.addListener(message => {
  if (message !== "START_AUTH")
    return;

  return browser.identity.launchWebAuthFlow({
    url: `https://anilist.co/api/v2/oauth/authorize?client_id=${process.env.VUE_APP_ANILIST_APP_ID}&response_type=token`,
    interactive: true,
  }).then(async response => {
    const keyVal = response.split("#")[1].split("&");
    const token = keyVal[0].split("=")[1];

    // In some user environments, the popup closes upon completion of login prompt
    // To support these cases, we set the token and lastPage here instead of relying on the frontend to do so
    await browser.storage.local.set({ token, lastPage: "list" });

    return token;
  });
});