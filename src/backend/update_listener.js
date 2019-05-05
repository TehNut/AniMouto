chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === "update") {
    chrome.storage.local.get({ oldschool: true }, value => {
      if (value.oldschool) {
        console.log("Clearing old data since we're updating from 1.0 to 2.0.");
        chrome.storage.local.clear();
        chrome.storage.local.set({ oldschool: false });
        return;
      }
    });
  }
});
