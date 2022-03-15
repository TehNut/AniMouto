import { runtime } from "webextension-polyfill";
import { beginAuthentication } from "./auth";

type Message = { type: "AUTH", data: any };

runtime.onMessage.addListener(async (message: Message, sender) => {
  if (!message.type)
    return;

  switch (message.type) {
    case "AUTH": {
      return await beginAuthentication();
    }
  }
});