document.addEventListener("DOMContentLoaded", e => {
  let button = document.getElementById("login-button");
  button.removeEventListener("click", auth);
  button.addEventListener("click", e => auth());
});

function auth() {
  chrome.runtime.getBackgroundPage(page => page.beginAuthorizationFlow());
}
