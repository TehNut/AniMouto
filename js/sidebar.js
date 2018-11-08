const pages = {
  medialist: {
    id: "medialist",
    icon: "format_list_bulleted",
    exists: false
  },
  search: {
    id: "search",
    icon: "search",
    exists: false
  },
  notifications: {
    id: "notifications",
    icon: "mail",
    exists: false
  },
  // sitetweaks: {
  //   id: "sitetweaks",
  //   icon: "extension",
  //   exists: false
  // },
  settings: {
    id: "settings",
    icon: "settings",
    exists: false
  },
  about: {
    id: "about",
    icon: "face",
    exists: false
  },
  login: {
    id: "login",
    exists: false
  }
};

chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.type === "change_avatar")
    document.getElementById("user-avatar").src = message.avatar;

  if (message.type === "change_theme")
    changeTheme(message.theme, null);

  if (message.type === "change_accent")
    changeTheme(null, message.accent_color);
});

let currentPage = "";

document.addEventListener("DOMContentLoaded", e => {
  Object.keys(pages).forEach(key => {
    key = pages[key];
    if (key.id === "login")
      return;

    let listElement = document.createElement("li");
    listElement.style.cursor = "hover";
    listElement.insertAdjacentHTML("beforeend", "<i class='material-icons'>" + key.icon + "</i>");
    listElement.addEventListener("click", e => {
      if (currentPage === key.id)
        return;

      changePage(key.id);
      chrome.storage.local.set({
        last_page: key.id
      }, () => {});
    });

    document.getElementById("navigation").insertAdjacentElement("beforeend", listElement);
  })

  chrome.storage.local.get({ user_info: { site_url: "https://anilist.co", avatar: "https://s3.anilist.co/user/avatar/medium/default.png" } }, value => {
    let avatarElement = document.getElementById("avatar");
    avatar.insertAdjacentHTML("beforeend", "<a href='" + value.user_info.site_url + "' target='_blank'><img id='user-avatar' src='" + value.user_info.avatar + "'></a>")
  });

  changePage(null); // Load last page or login page
  // chrome.storage.local.get({ theme: "light", accent_color: "color-blue" }, value => {
  //   changeTheme(value.theme, value.accent_color);
  // });
});

function changePage(page) {
  chrome.storage.local.get({
    last_page: "medialist",
    access_token: ""
  }, value => {
    let lastView = document.getElementById("viewport-" + currentPage);
    if (lastView)
      lastView.style.display = "none";
    let showPage = value.access_token === "" ? currentPage = "login" : currentPage = (page ? page : value.last_page);

    pageEntry = pages[showPage];
    if (pageEntry && !pageEntry.exists) {
      let frame = document.createElement("iframe");
      frame.width = 470;
      frame.height = 600;
      frame.frameBorder = "none";
      frame.style.display = "none";
      frame.id = "viewport-" + pageEntry.id;
      frame.src = "./html/" + pageEntry.id + ".html";
      document.getElementById("content").insertAdjacentElement("beforeend", frame);

      pageEntry.exists = true;
    }
    document.getElementById("viewport-" + showPage).style.display = "initial";
  });
}

function changeTheme(theme, accent) {
  if (accent)
    document.documentElement.style.setProperty("--color-accent", "var(--" + accent + ")");

  Object.keys(pages).forEach(key => {
    key = pages[key];
    if (!key.exists)
      return;

    let frame = document.getElementById("viewport-" + key.id);
    frame.contentWindow.setTheme(theme, accent);
  });
}
