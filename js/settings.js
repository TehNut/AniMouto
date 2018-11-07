document.addEventListener("DOMContentLoaded", e => {
  chrome.storage.local.get({ user_info: { name: "", id: 0, site_url: "" } }, value => {
    let loginText = "Logged in as <a href='" + value.user_info.site_url + "' style='color:rgb(var(--color-blue));font_weight:bold;' target='_blank'>" + value.user_info.name + "</a>";
    document.getElementById("login-name").insertAdjacentHTML("afterbegin", loginText);

    document.getElementById("theme-light").addEventListener("click", () => setTheme("light"));
    document.getElementById("theme-dark").addEventListener("click", () => setTheme("dark"));
    document.getElementById("theme-contrast").addEventListener("click", () => setTheme("contrast"));

    document.getElementById("logout-button").addEventListener("click", () => {
      chrome.storage.local.clear();
      window.close();
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
  chrome.storage.local.set({ accent_color: newColorProp }, () => {});
  document.documentElement.style.setProperty("--color-accent", "var(--" + newColorProp + ")");
}
