const isChrome = typeof InstallTrigger === 'undefined';

document.addEventListener("DOMContentLoaded", e => {
  document.getElementById((isChrome ? "chrome" : "firefox") + "-auth").style.display = "inline-block";

  if (isChrome)
    handleChrome();
  else
    handleFirefox();
});

function handleChrome() {
  let button = document.getElementById("chrome-login-button");
  button.removeEventListener("click", authChrome);
  button.addEventListener("click", e => authChrome(e.target));

  chrome.storage.local.get({ access_token: "" }, value => {
    if (value.access_token === "")
      return;

    button.title = "Already logged in.";
    button.classList.add("disabled");
  });
}

function handleFirefox() {
  let getCodeButton = document.getElementById("firefox-get-button");
  getCodeButton.removeEventListener("click", getAuthenticationCode);
  getCodeButton.addEventListener("click", e => getAuthenticationCode());

  let input = document.getElementById("auth-input");

  let loginButton = document.getElementById("firefox-login-button");
  loginButton.removeEventListener("click", tryLogin);
  loginButton.addEventListener("click", e => tryLogin(input.value.trim()));

  input.addEventListener("keyup", e => {
    if (input.value.trim() === "")
      loginButton.classList.add("disabled");
    else
      loginButton.classList.remove("disabled");
  });
}

function authChrome(button) {
  if (button.classList.contains("disabled"))
    return;

  button.classList.add("disabled");
  document.getElementById("chrome-loader").style.display = "inline-block";
  chrome.runtime.getBackgroundPage(page => page.beginAuthorizationFlow());
}

function getAuthenticationCode() {
  document.getElementById("firefox-loader").style.display = "inline-block";
  chrome.runtime.getBackgroundPage(page => page.beginAuthorizationFlow());
}

function tryLogin(token) {
  chrome.runtime.getBackgroundPage(page => page.validateToken(token));
}

function resetFirefox() {
  let loginButton = document.getElementById("firefox-login-button");
  if (!loginButton.classList.contains("disabled"))
    loginButton.classList.add("disabled");

  let input = document.getElementById("auth-input");
  input.value = "";
}
