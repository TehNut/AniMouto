import { browser } from "webextension-polyfill-ts";
import { MessageType } from "@/background-scripts/Background";

browser.runtime.onMessage.addListener(async message => {
  if (message !== MessageType.START_AUTH)
    return;

  const response = await browser.identity.launchWebAuthFlow({
    url: `https://anilist.co/api/v2/oauth/authorize?client_id=${process.env.VUE_APP_ANILIST_APP_ID}&response_type=token`,
    interactive: true,
  });
  const keyVal = response.split("#")[1].split("&");
  const token = keyVal[0].split("=")[1];

  return Promise.resolve(token);
});