chrome.storage.local.get({access_token: ""}, value => {
  if (value.access_token === "") {
    beginAuth();
  } else {
    beginMediaList(value.access_token);
  }
});

function beginAuth() {
  document.getElementsByTagName("body")[0].removeChild(document.getElementById("container"));
  document.getElementsByTagName("body")[0].insertAdjacentHTML("afterbegin", "<div id='login'><div id='login-button' class='button'>Login with AniList</div></div>");
  document.getElementById("login-button").addEventListener("click", () => chrome.runtime.sendMessage({command: "start_oauth"}));
}
