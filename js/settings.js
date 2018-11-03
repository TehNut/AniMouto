document.addEventListener("DOMContentLoaded", e => {
  chrome.storage.local.get({ user_info: { name: "", id: 0, site_url: "" } }, value => {
    let loginText = "Logged in as <a href='" + value.user_info.site_url + "' style='color:rgb(var(--color-text-bright));font-weight:bold;' target='_blank'>" + value.user_info.name + "</a>";
    document.getElementById("login-name").insertAdjacentHTML("afterbegin", loginText);

    document.getElementById("logout-button").addEventListener("click", () => {
      chrome.storage.local.remove(["access_token", "refresh_token", "user_info"], value => {});
      window.close();
    });
  });
});
