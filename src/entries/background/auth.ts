import { identity, storage } from "webextension-polyfill";

export async function beginAuthentication(): Promise<string> {
  try {
    const response = await identity.launchWebAuthFlow({
      url: `https://anilist.co/api/v2/oauth/authorize?client_id=${import.meta.env.VITE_ANILIST_APP_ID}&response_type=token`,
      interactive: true
    });

    const keyVal = response.split("#")[1].split("&");
    const token = keyVal[0].split("=")[1];

    // In some user environments, the popup closes upon completion of login prompt
    // To support these cases, we set the token and lastPage here instead of relying on the frontend to do so
    await storage.local.set({ token, lastPage: "/medialist" });
  
    return token;
  } catch (e) {
    console.log(e)
  }
}