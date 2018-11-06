const themes = [
  "light",
  "dark"
]

chrome.storage.local.get({ theme: "light", accent_color: "color-blue" }, value => {
  setTheme(value.theme);
  document.documentElement.style.setProperty("--color-accent", "var(--" + value.accent_color + ")");
});

function setTheme(theme) {
  chrome.storage.local.set({ theme: theme }, () => {});
  document.documentElement.className = "theme-" + theme;
}
