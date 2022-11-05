import { runtime } from "webextension-polyfill";
import { beginAuthentication } from "./auth";
import { setupAlarms, updateNotificationCount } from "./notifications";

type Message = { 
  type: "AUTH" | "RESET_ALARMS" | "UPDATE_NOTIFICATION_COUNT",
  data: any
};

runtime.onMessage.addListener(async (message: Message, sender) => {
  if (!message.type)
    return;

  switch (message.type) {
    case "AUTH": return await beginAuthentication();
    case "RESET_ALARMS": return await setupAlarms();
    case "UPDATE_NOTIFICATION_COUNT": return await updateNotificationCount();
  }
});

export async function queryAniList<T = any>({ query, token, variables }: { query: string, token?: string, variables?: Record<string, any> }): Promise<{ data: T }> {
  const headers: Record<string, string> = {
    "Accept": "application/json",
    "Content-Type": "application/json"
  };
  if (token)
    headers.Authorization = `Bearer ${token}`;
    
  return fetch("https://graphql.anilist.co", {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      variables
    })
  }).then(res => res.json() as Promise<{ data: T }>);
}