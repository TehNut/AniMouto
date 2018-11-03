const themes = {
  light: {
    color_background: "237,241,245",
    color_foreground: "250,250,250",
    color_foreground_grey: "245,246,246",
    color_foreground_grey_dark: "234,236,237",
    color_foreground_blue: "246,248,251",
    color_foreground_blue_dark: "241,243,247",
    color_text: "92,114,138",
    color_text_light: "122,133,143",
    color_text_lighter: "146,153,161",
  },
  dark: {
    color_background: "39,44,56",
    color_foreground: "31,35,45",
    color_foreground_grey: "25,29,38",
    color_foreground_grey_dark: "16,20,25",
    color_foreground_blue: "25,29,38",
    color_foreground_blue_dark: "19,23,29",
    color_text: "159,173,189",
    color_text_light: "129,140,153",
    color_text_lighter: "133,150,165",
  }
}

document.addEventListener("DOMContentLoaded", e => {
  chrome.storage.local.get({ theme: "light" }, value => {
    setTheme(value.theme);
  });
});

function setTheme(theme) {
  chrome.storage.local.set({ theme: theme}, () => {});
  Object.keys(themes[theme]).forEach(key => {
    let value = themes[theme][key];
    document.documentElement.style.setProperty("--" + key.replace("_", "-"), value);
  })
}
