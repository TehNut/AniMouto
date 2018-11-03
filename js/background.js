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

    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {
                    urlMatches: "(.*)"
                },
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
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
            client_secret: "${client_secret}",
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
