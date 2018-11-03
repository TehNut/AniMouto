chrome.storage.local.get({access_token: ""}, value => {
  if (value.access_token === "") {
    beginAuth();
  } else {
    beginMediaList();
  }
});

function beginAuth() {
  document.getElementById("login").style.display = "initial";
  document.getElementById("login-button").addEventListener("click", () => chrome.runtime.sendMessage({command: "start_oauth"}));
}

function beginMediaList() {
  if (document.getElementById("login").style.display === "initial") {
      document.getElementById("login").style.display = "none";
      document.getElementById("login-button").removeEventListener("click");
  }

  document.getElementById("container").style.display = "initial";
  document.getElementById("logout-button").addEventListener("click", () => {
    chrome.storage.local.remove(["access_token", "refresh_token"], value => {});
    window.close();
  });

  anilistCall("{Viewer{id name siteUrl}}", {}, value.access_token)
    .then(viewerRes => viewerRes.json())
    .then(viewerRes => viewerRes.data.Viewer)
    .then(viewerRes => {
      document.getElementById("login-name").insertAdjacentHTML("afterbegin", "Logged in as <a href='" + viewerRes.siteUrl + "'  target='_blank'>" + viewerRes.name + "</a>");
      handleList(viewerRes.id, value.access_token);
    });
}
