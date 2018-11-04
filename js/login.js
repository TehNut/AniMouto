document.addEventListener("DOMContentLoaded", e => {
  let button = document.getElementById("login-button");
  button.removeEventListener("click", beginAuthentication);
  button.addEventListener("click", e => beginAuthentication());
});

function beginAuthentication() {
  chrome.runtime.sendMessage({
    command: "start_oauth"
  });
}
