document.addEventListener("DOMContentLoaded", e => {
  chrome.storage.local.get({ user_info: { name: "", id: 0, site_url: "" } }, value => {
    let loginText = "Logged in as <a href='" + value.user_info.site_url + "' style='color:rgb(var(--color-accent));font_weight:bold;' target='_blank'>" + value.user_info.name + "</a>";
    document.getElementById("login-name").insertAdjacentHTML("afterbegin", loginText);

    document.getElementById("theme-light").addEventListener("click", () => changeTheme("light"));
    document.getElementById("theme-dark").addEventListener("click", () => changeTheme("dark"));
    document.getElementById("theme-contrast").addEventListener("click", () => changeTheme("contrast"));

    document.getElementById("logout-button").addEventListener("click", () => {
      chrome.storage.local.clear();
      chrome.runtime.sendMessage({ type: "change_page", page: "login" });
      chrome.runtime.sendMessage({ type: "change_avatar", avatar: "https://s3.anilist.co/user/avatar/medium/default.png" });
    });

    let accentButtons = document.getElementsByClassName("accent-button");
    for (let element in accentButtons) {
      if (accentButtons.hasOwnProperty(element)) {
        element = accentButtons[element];
        element.removeEventListener("click", changeColor);
        element.addEventListener("click", e => changeColor(element));
      }
    }
  });
});

function changeColor(element) {
  let newColorProp = element.id.replace("accent", "color");
  chrome.storage.local.set({ accent_color: newColorProp });
  chrome.runtime.sendMessage({ type: "change_accent", accent_color: newColorProp })
}

function changeTheme(theme) {
  chrome.storage.local.set({ theme: theme })
  chrome.runtime.sendMessage({ type: "change_theme", theme: theme });
}
