const pages = {
  medialist: {
    id: "medialist",
    icon: "format_list_bulleted",
    exists: false
  },
  search: {
    id: "search",
    exists: false
  },
  forum: {
    id: "forum",
    exists: false
  },
  notifications: {
    id: "notifications",
    exists: false,
    postHandle: function() {
      chrome.browserAction.getBadgeText({}, text => {
        if (text !== "" && parseInt(text) > 0)
          updateNotifications(parseInt(text));
      });
    }
  },
  settings: {
    id: "settings",
    exists: false
  },
  about: {
    id: "about",
    icon: "info",
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

  if (message.type === "update_notifications")
    updateNotifications(message.notification_count);

  if (message.type === "change_theme")
    changeTheme(message.theme, null);

  if (message.type === "change_accent")
    changeTheme(null, message.accent_color);

  if (message.type === "change_page")
    changePage(message.page);

  if (message.type === "display_toast")
    displayToast(message.toast);

  if (message.type === "login_failure")
    resetFirefox();
});

let currentPage = "";

document.addEventListener("DOMContentLoaded", e => {
  Object.keys(pages).forEach(key => {
    key = pages[key];
    if (key.id === "login")
      return;

    let listElement = document.createElement("li");
    listElement.id = key.id;
    listElement.style.cursor = "hover";
    listElement.insertAdjacentHTML("beforeend", "<i class='material-icons'>" + (key.icon ? key.icon : key.id) + "</i>");
    listElement.addEventListener("click", e => {
      if (currentPage === key.id)
        return;

      changePage(key.id);
      chrome.storage.local.set({
        last_page: key.id
      }, () => {});
    });

    document.getElementById("navigation").insertAdjacentElement("beforeend", listElement);
    if (key.postHandle)
      key.postHandle();
  });

  chrome.storage.local.get({ user_info: { site_url: "https://anilist.co", avatar: "https://s3.anilist.co/user/avatar/medium/default.png" } }, value => {
    let avatarElement = document.getElementById("avatar");
    avatar.insertAdjacentHTML("beforeend", "<a href='" + value.user_info.site_url + "' target='_blank'><img id='user-avatar' src='" + value.user_info.avatar + "'></a>")
  });

  changePage(null); // Load last page or login page
});

function changePage(page) {
  chrome.storage.local.get({ last_page: "medialist", access_token: "" }, value => {
    if (value.access_token === "" && currentPage === "login")
      return;

    let lastView = document.getElementById("viewport-" + currentPage);
    if (lastView)
      lastView.style.display = "none";

    let showPage = value.access_token === "" ? currentPage = "login" : currentPage = (page ? page : value.last_page);

    if (showPage === "login") {
      let loginFrame = document.getElementById("viewport-login");
      if (loginFrame) {
        pages.login.exists = false;
        loginFrame.parentNode.removeChild(loginFrame);
      }
    }

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

function updateNotifications(amount) {
  let tooBig = amount > 99;

  let notificationEntry = document.getElementById("notifications");
  let icon = notificationEntry.childNodes[0];
  icon.innerText = amount > 0 ? "notifications_active" : "notifications";

  let countDiv = notificationEntry.childNodes[1];
  if (!countDiv) {
    countDiv = document.createElement("div");
    countDiv.className = "notification-text";
    notificationEntry.insertAdjacentElement("beforeend", countDiv);
  }

  countDiv.style.display = amount > 0 ? "inline-block" : "none";
  countDiv.innerText = tooBig ? "99+" : amount.toString();
}

function displayToast(toast) {
  let newToast = document.createElement("div");
  newToast.className = "toast " + toast.type;
  newToast.innerText = toast.text;
  document.getElementById("toast").insertAdjacentElement("beforeend", newToast);
  setTimeout(() => newToast.parentNode.removeChild(newToast), 5000);
}
