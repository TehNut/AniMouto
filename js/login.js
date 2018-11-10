document.addEventListener("DOMContentLoaded", e => {
  let button = document.getElementById("login-button");
  button.removeEventListener("click", auth);
  button.addEventListener("click", e => auth(e.target));

  chrome.storage.local.get({ access_token: "" }, value => {
    if (value.access_token === "")
      return;

    button.title = "Already logged in.";
    button.classList.add("disabled");
  });
});

function auth(button) {
  if (button.classList.contains("disabled"))
    return;

  button.classList.add("disabled");
  document.getElementById("loader").style.display = "inline-block";
  chrome.runtime.getBackgroundPage(page => page.beginAuthorizationFlow());
}
