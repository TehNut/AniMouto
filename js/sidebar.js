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

document.addEventListener("DOMContentLoaded", e => {
  let currentPage = "";

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
    avatar.insertAdjacentHTML("beforeend", "<a href='" + value.user_info.site_url + "' target='_blank'><img src='" + value.user_info.avatar + "'></a>")
  })

  changePage(null); // Load last page or login page

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
        document.getElementById("content").insertAdjacentHTML("beforeend", "<iframe id='viewport-" + pages[showPage].id + "' src='./html/" + pages[showPage].id + ".html' width='470' height='600' frameborder='0' style='display:none;'></iframe>")
        pageEntry.exists = true;
      }
      document.getElementById("viewport-" + showPage).style.display = "initial";
    });
  }
})
