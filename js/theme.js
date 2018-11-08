chrome.storage.local.get({ theme: "light", accent_color: "color-blue" }, value => {
  window.parent.changeTheme(value.theme, value.accent_color);
});

function setTheme(theme, accent) {
  if (theme)
    document.documentElement.className = "theme-" + theme;
  if (accent)
    document.documentElement.style.setProperty("--color-accent", "var(--" + accent + ")");
}
